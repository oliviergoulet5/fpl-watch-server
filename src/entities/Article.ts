import { Field, Int, ObjectType } from 'type-graphql';
import { Account } from './Account';

@ObjectType()
export class Article {
    @Field(() => Int)
    id: number;

    @Field()
    title: string;

    @Field(() => String)
    content: string;

    @Field(() => String)
    date: Date;

    @Field(() => String)
    category: String;

    @Field(() => [String])
    tags: String[];

    // Author
    authorId: number;

    // Likes
    @Field(() => [Account], { defaultValue: [] })
    likedBy: Account[];

    dislikedBy: Account[];
}