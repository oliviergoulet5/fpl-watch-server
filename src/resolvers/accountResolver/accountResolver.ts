import { Account } from '../../entities/Account';
import { Context } from '../../types';
import {
    Resolver,
    Query,
    Mutation,
    Ctx,
    Arg,
} from 'type-graphql';
import { RegisterInput, AccountResponse, LoginInput, UpdateInput } from './accountTypes';
import argon2 from 'argon2';
import { ACCOUNT_COOKIE_NAME } from '../../constants';
import FieldError from 'src/entities/FieldError';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import AWS from 'aws-sdk';

const s3Bucket = process.env.S3_BUCKET;

@Resolver()
class AccountResolver {
    // Me Query
    @Query(() => Account, { nullable: true })
    async me(@Ctx() { req, prisma }: Context) {
        if (!req.session.accountId) return null;

        const account = await prisma.account.findUnique({
            where: { id: req.session.accountId }
        });

        return account;
    }

    // Accounts Query
    @Query(() => [Account], { nullable: true })
    async accounts(
        @Ctx() { prisma }: Context,
        @Arg('id', { nullable: true }) id?: number,
    ) {
        const accounts = await prisma.account.findMany({
            where: { id }
        });

        return accounts;
    }

    // Login Mutation
    @Mutation(() => AccountResponse)
    async login(
        @Arg('options') options: LoginInput,
        @Ctx() { req, prisma }: Context
    ) {
        const account = await prisma.account.findUnique({
            where: { email: options.email }
        });

        if (!account) return {
            errors: [
                {
                    field: 'email',
                    message: 'account belonging to email does not exist'
                }
            ]
        }
        
        const valid = await argon2.verify(account.password, options.password);

        if (!valid) return {
            errors: [
                {
                    field: 'password',
                    message: 'incorrect password'
                }
            ]
        }

        req.session.accountId = account.id;

        return { account };
    }

    // Logout Mutation
    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: Context) {
        return new Promise(resolve => 
            req.session.destroy((error: any) => {
                res.clearCookie(ACCOUNT_COOKIE_NAME);

                if (error) {
                    resolve(false);
                    return;
                } else {
                    resolve(true);
                    return;
                }
            })    
        );
    }

    // Register Mutation
    @Mutation(() => AccountResponse)
    async register(
        @Arg('options') options: RegisterInput,
        @Ctx() { req, prisma }: Context
    ) {
        if (options.username.length <= 2 || options.username.length > 25) {
            return {
                errors: [
                    {
                        field: 'username',
                        message: 'username must be between 3-25 characters.'
                    }
                ]
            }
        }

        if (options.password.length < 8) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'password must be 8 or more characters'
                    }
                ]
            }
        }

        const hashedPassword = await argon2.hash(options.password);
        let account;

        try {
            account = await prisma.account.create({
                data: {
                    email: options.email,
                    password: hashedPassword,
                    username: options.username,
                    createdAt: new Date(),
                    updatedAt: new Date()
                }
            });
        } catch (error) {
            if (error.code === '23505') return {
                errors: [
                    {
                        field: 'username',
                        message: 'username already taken'
                    }
                ]
            }
        }

        if (!account) return {
            errors: [
                { field: 'unknown', message: 'account not created' }
            ]
        }

        // login
        req.session.accountId = account.id;

        return { account };
    }

    // Update Account
    @Mutation(() => AccountResponse)
    async updateAccount(
        @Arg('options') options: UpdateInput,
        @Ctx() { req, prisma }: Context
    ) {
        const accountNotSignedIn: FieldError = {
            field: 'n/a',
            message: 'user not signed in'
        };

        if (!req.session.accountId) return {
            errors: [ accountNotSignedIn ]
        }

        const account = await prisma.account.update({
            where: { id: req.session.accountId },
            data: { 
                ...options
            }
        })

        return { account };
    }
    
    @Mutation(() => String)
    async updateAvatar(
        @Ctx() { req, prisma }: Context,
        @Arg('avatar', () => GraphQLUpload) {
            createReadStream
        }: FileUpload): Promise<string> {
            return new Promise(async (resolve) => {
                const account = await prisma.account.findUnique({
                    where: { id: req.session.accountId }
                });

                if (!account) return resolve('Error');

                const s3 = new AWS.S3({
                    signatureVersion: 'v4',
                    region: 'us-east-2'
                });

                s3.upload({
                    Body: createReadStream(),
                    Bucket: s3Bucket!,
                    Key: `avatars/${account!.id}`,
                    ACL: 'public-read',
                    ContentType: 'jpg',
                }, (_, data) => {
                    if (data) {
                        prisma.account.update({
                            where: { id: account.id },
                            data: {
                                avatarLocation: data.Location
                            }
                        });
                        resolve(data.Location);
                    } else {
                        resolve('Error');
                    }
                })
            });
        }
    

}

export default AccountResolver;