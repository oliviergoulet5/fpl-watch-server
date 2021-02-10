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
    email: string;

    @Field()
    password: string;
}

@InputType()
class AccountInput extends LoginInput {
    @Field()
    username: string;

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
    @Query(() => Account, { nullable: true })
    async me(@Ctx() { req, em }: Context) {
        if (!req.session.accountId) {
            return null;
        }

        const account = await em.findOne(Account, { id: req.session.accountId });
        return account;
    }
    
    @Query(() => [Account])
    accounts(@Ctx() { em }: Context): Promise<Account[]> {
        return em.find(Account, {});
    }

    @Mutation(() => AccountResponse)
    async register(
        @Arg('options') options: AccountInput,
        @Ctx() { em, req }: Context
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
            if (err.code === '23505') { // needs to differentiate between username and email errors
                return {
                    errors: [
                        {
                            field: 'username',
                            message: 'username already taken',
                        },
                    ],
                };
            }
        }

        // auto-login after registration
        req.session.accountId = account.id;
        
        return { account };
    }

    @Mutation(() => AccountResponse)
    async login(
        @Arg('options') options: LoginInput,
        @Ctx() { em, req }: Context
    ): Promise<AccountResponse> {
        const account = await em.findOne(Account, {
            email: options.email,
        });

        if (!account) {
            return {
                errors: [
                    {
                        field: 'email',
                        message: 'account belonging to email does not exist',
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