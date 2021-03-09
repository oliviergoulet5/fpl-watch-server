import { Account } from '../../entities/Account';
import { Context } from '../../types';
import { EntityManager } from '@mikro-orm/postgresql';
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
import FieldError from '../../entities/FieldError';
import { ACCOUNT_COOKIE_NAME } from '../../constants';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import AWS from 'aws-sdk';

const s3Bucket = process.env.S3_BUCKET;

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

@InputType()
class UpdateAccountInput {
    @Field({ nullable: true }) // not yet implemented
    username?: string;

    @Field({ nullable: true }) // not yet implemented
    email?: string;

    @Field({ nullable: true }) // not yet implemented
    password?: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    bio?: string;

    @Field({ nullable: true })
    favouriteTeam?: string;
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

        const account = await em.findOne(Account, {
            id: req.session.accountId,
        });

        return account;
    }

    @Query(() => [Account])
    accounts(
        @Ctx() { em }: Context,
        @Arg('id', { nullable: true }) id?: number,
    ): Promise<Account[]> {
        let filters = { id };
        
        return em.find(Account, {...filters});
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

        let account;
        try {
            const result = await (em as EntityManager)
                .createQueryBuilder(Account)
                .getKnexQuery()
                .insert({
                    username: options.username,
                    password: hashedPassword,
                    email: options.email,
                    name: options.name,
                    created_at: new Date(),
                    updated_at: new Date(),
                })
                .returning('*');

            account = result[0];
        } catch (err) {
            if (err.code === '23505') {
                // needs to differentiate between username and email errors
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
        console.log('Id: ' + account.id);
        req.session.accountId = account.id;

        return { account };
    }

    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: Context) {
        return new Promise(resolve =>
            req.session.destroy((err: any) => {
                res.clearCookie(ACCOUNT_COOKIE_NAME);

                if (err) {
                    console.log(err);
                    resolve(false);
                    return;
                } else {
                    resolve(true);
                    return;
                }
            })
        );
    }

    @Mutation(() => AccountResponse)
    async updateAccount(
        @Ctx() { req, em }: Context,
        @Arg('options') options: UpdateAccountInput,
    ): Promise<AccountResponse> {
        let accountNotSignedInError: FieldError = {
            field: 'n/a',
            message: 'user not signed in'
        }

        if (!req.session.accountId) return { errors: [ accountNotSignedInError ]}

        let account = await em.findOne(Account, {
            id: req.session.accountId
        });

        if (!account) return {
            errors: [
                accountNotSignedInError
            ]
        };
        
        options.name && (account.name = options.name);
        options.bio && (account.bio = options.bio);
        options.favouriteTeam && (account.favouriteTeam = options.favouriteTeam);

        try {
            await em.persistAndFlush(account);

        } catch (err) {

            return {
                errors: [
                    {
                        field: 'unknown',
                        message: 'issue processing persist'
                    }
                ]
            }
        }
        
        return { account }
    }
    
    // Why is this mutation required instead of just simply using updateAccount? 
    // https://github.com/jaydenseric/graphql-multipart-request-spec
    @Mutation(() => String)
    async updateAvatar(
        @Ctx() { req, em }: Context,
        @Arg('avatar', () => GraphQLUpload) {
            createReadStream
        }: FileUpload): Promise<String> {
            return new Promise(async (resolve) => {
                let account = await em.findOne(Account, {
                    id: req.session.accountId
                });

                if (!account) return resolve('Error');

                const s3 = new AWS.S3({
                    signatureVersion: 'v4',
                    region: 'us-east-2'
                });

                //let storedLocation: string | undefined;
                s3.upload({
                    Body: createReadStream(),
                    Bucket: s3Bucket!,
                    Key: `avatars/${account!.id}`,
                    ACL: 'public-read',
                    ContentType: 'jpg',
                }, (_, data) => {
                    if (account && data) {
                        account.avatarLocation = data.Location;
                        console.log(data.Location);
                        em.persistAndFlush(account).finally(() => resolve(data.Location));
                    } else {
                        resolve('Error');
                    }
                });
            }
        )
    }
}

export default AccountResolver;

// Todo:

// Instead of AccountResponse do: AccountResponse | FieldError | AuthenticationError for more flexibility
