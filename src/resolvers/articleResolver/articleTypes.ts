import { InputType, Field, Int, ObjectType } from 'type-graphql';
import { Article } from '../../entities/Article';
import { Error } from '../../entities/errors';

@InputType()
export class ArticleInput {
    @Field(() => Int)
    authorId: number;

    @Field()
    title: string;

    @Field()
    content: string;

    @Field(() => String, { nullable: true })
    category: string;

    @Field(() => [String], { nullable: true })
    tags: string[];
}

@InputType()
export class EditArticleInput {
    @Field(() => String, { nullable: true })
    title?: string;

    @Field(() => String, { nullable: true })
    content?: string;

    @Field(() => String, { nullable: true })
    category?: string;

    @Field(() => [String], { nullable: true })
    tags?: string[];
}

@ObjectType()
export class ArticleResponse {
    @Field(() => Error, { nullable: true })
    error?: Error;

    @Field(() => Article, { nullable: true })
    article?: Article;
}