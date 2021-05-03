import { ObjectType, Field } from 'type-graphql';

@ObjectType({ description: 'Collection of social media profiles for a club or player.' })
export class SocialMedia {
    @Field({ nullable: true })
    facebook?: string;

    @Field({ nullable: true })
    instagram?: string;

    @Field({ nullable: true })
    twitter?: string;

    @Field({ nullable: true })
    youtube?: string;

    @Field({ nullable: true })
    tiktok?: string;
}