import { Account } from '../../entities/Account';
import { Context } from '../../types';
import {
    Resolver,
    Query,
    Mutation,
    Ctx,
    Arg,
} from 'type-graphql';
import { RegisterInput, AccountResponse, UnverifiedAccountResponse, LoginInput, UpdateInput } from './accountTypes';
import argon2 from 'argon2';
import { ACCOUNT_COOKIE_NAME } from '../../constants';
import { useCharacterRangeError, useAlreadyExistError, useUnknownError, sendVerificationEmail, useIncorrectFieldError } from '../../utils';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import AWS from 'aws-sdk';
import { unverifiedAccounts as UnverifiedAccount } from '@prisma/client';

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

        if (!account) return useIncorrectFieldError('email');

        const valid = await argon2.verify(account.password, options.password);

        if (!valid) return useIncorrectFieldError('password');

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
    @Mutation(() => UnverifiedAccountResponse)
    async register(
        @Arg('options') options: RegisterInput,
        @Ctx() { prisma }: Context
    ) {
        if (options.username.length <= 2 || options.username.length > 25) return useCharacterRangeError('username', { min: 2, max: 25 }) 
        if (options.password.length < 8) return useCharacterRangeError('password', { min: 8 }) 

        const emailTaken = await prisma.account.findUnique({
            where: {
                email: options.email
            }
        });
        
        if (emailTaken) return useAlreadyExistError('email')

        const usernameTaken = await prisma.account.findUnique({
            where: {
                username: options.username
            }
        });

        if (usernameTaken) return useAlreadyExistError('username')
        
        const hashedPassword = await argon2.hash(options.password);
        let unverifiedAccount: UnverifiedAccount | undefined;

        try {
            unverifiedAccount = await prisma.unverifiedAccounts.create({
                data: {
                    email: options.email,
                    password: hashedPassword,
                    username: options.username,
                }
            });

            sendVerificationEmail(unverifiedAccount.email, unverifiedAccount.code)
                .catch(error => {
                    throw error;
                });

        } catch (error) {
            return useUnknownError(error);
        }

        return { unverifiedAccount };
    }
    
    @Mutation(() => AccountResponse)
    async verify(
        @Arg('email') email: string,
        @Arg('code') code: string,
        @Ctx() { prisma }: Context
    ) {
        try {
            const verifyingAccount = await prisma.unverifiedAccounts.findUnique({
                where: {
                    email
                }
            });
            // Todo: create a mutation to generate a new code.
            if (!verifyingAccount) return useUnknownError('An account with that email could not be found. Try a new code.');

            if (verifyingAccount.code !== code) return useUnknownError('The verification code provided did not match.')
            
            return await prisma.account.create({
                data: {
                    email: verifyingAccount.email,
                    username: verifyingAccount.username,
                    password: verifyingAccount.password
                }
            });

        } catch (error) {
            return useUnknownError(error);
        }
    }

    // Update Account
    @Mutation(() => AccountResponse)
    async updateAccount(
        @Arg('options') options: UpdateInput,
        @Ctx() { req, prisma }: Context
    ) {
        if (!req.session.accountId) return {
            error: {
                formError: {
                    message: 'user is not signed in'
                }
            }
        }

        console.log('Something');

        const account = await prisma.account.update({
            where: { id: req.session.accountId },
            data: { 
                ...options
            }
        });
        console.log(account);
        if (!account) return useUnknownError('could not update account');

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