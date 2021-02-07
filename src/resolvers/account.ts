import { Account } from '../entities/Account';
import { Context } from '../types';
import {
    Resolver,
    Query,
    Ctx,
    Mutation,
    Field,
    InputType,
    Arg,
    ObjectType,
} from 'type-graphql';
import argon2 from 'argon2';
import FieldError from '../entities/FieldError';

@InputType()
class LoginInput {
    @Field()
    username: string;

    @Field()
    password: string;
}

@InputType()
class AccountInput extends LoginInput {
    @Field()
    email: string;

    @Field({ nullable: true })
    name?: string;
}

@ObjectType()
class AccountResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Account, { nullable: true })
    account?: Account;
}

@Resolver()
class AccountResolver {
    @Query(() => [Account])
    accounts(@Ctx() { em }: Context): Promise<Account[]> {
        return em.find(Account, {});
    }

    @Mutation(() => AccountResponse)
    async register(
        @Arg('options') options: AccountInput,
        @Ctx() { em }: Context
    ): Promise<AccountResponse> {
        if (options.username.length <= 2 || options.username.length > 25) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'username must be between 3-25 characters',
                    },
                ],
            };
        }

        if (options.password.length < 8) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'password must be 8 or more characters',
                    },
                ],
            };
        }

        const hashedPassword = await argon2.hash(options.password);
        const account = em.create(Account, {
            username: options.username,
            password: hashedPassword,
            email: options.email,
            name: options.name,
        });

        try {
            await em.persistAndFlush(account);
        } catch (err) {
            if (err.code === '23505') {
                return {
                    errors: [
                        {
                            field: 'username or field',
                            message: 'username or email already taken',
                        },
                    ],
                };
            }
        }
        
        return { account };
    }

    @Mutation(() => AccountResponse)
    async login(
        @Arg('options') options: LoginInput,
        @Ctx() { em, req }: Context
    ): Promise<AccountResponse> {
        const account = await em.findOne(Account, {
            username: options.username,
        });

        if (!account) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'account belonging to username does not exist',
                    },
                ],
            };
        }

        const valid = await argon2.verify(account.password, options.password);
        if (!valid) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'incorrect password',
                    },
                ],
            };
        }

        req.session.accountId = account.id;

        return { account };
    }
}

export default AccountResolver;
