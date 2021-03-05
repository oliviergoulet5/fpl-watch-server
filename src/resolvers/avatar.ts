import { Resolver, Mutation, Arg, Ctx } from 'type-graphql';
import AWS from 'aws-sdk';
import { FileUpload, GraphQLUpload } from 'graphql-upload';
import { Context } from '../types';
import { Account } from '../entities/Account';

const s3Bucket = process.env.S3_BUCKET;

if (!s3Bucket) console.error('Forgot to add S3 Bucket to environment variables.');

@Resolver()
class AvatarResolver {

    @Mutation(() => Boolean)
    async uploadAvatar(
        @Ctx() { req, em }: Context,
        @Arg('image', () => GraphQLUpload) {
            
            createReadStream
    }: FileUpload): Promise<Boolean> {
        return new Promise(async (resolve) => { 
            // Assigns account to file name and remove current avatar from database
            let account = await em.findOne(Account, {
                id: req.session.accountId
            });

            if (!account) return resolve(false);

            // AWS S3
            const s3 = new AWS.S3({
                signatureVersion: 'v4',
                region: 'us-east-2'
            });

            s3.upload({
                Body: createReadStream(),
                Bucket: s3Bucket!,
                Key: `avatars/${account.id}`,
                ACL: 'public-read',
                ContentType: 'jpg',
            }, (error, data) => {
                if (error) {
                    console.error(error);
                }

                if (data) {
                    console.log(data);
                }
            });
        });
    }
}

export default AvatarResolver;