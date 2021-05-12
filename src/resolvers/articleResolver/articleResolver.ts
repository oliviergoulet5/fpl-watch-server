import { Article } from "../../entities/Article";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, Int, ObjectType } from "type-graphql";
import { Context } from "../../types";
import { Error } from '../../entities/errors';
import { useUnknownError } from '../../utils/errors';

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

@Resolver()
export class ArticleResolver {
    @Query(() => [Article])
    async articles(
        @Ctx() { prisma }: Context,
        @Arg('id', { nullable: true }) id?: number
    ) {
        const articles = prisma.article.findMany({
            where: { id }
        });

        return articles;
    }

    @Mutation(() => ArticleResponse)
    async publishArticle(
        @Ctx() { prisma }: Context,
        @Arg('options') options: ArticleInput
    ) {
        try {
            const article = await prisma.article.create({
                data: { ...options }
            });

            return article;
        } catch (error) {
            return useUnknownError('An unknown error has occurred.');
        }
    }

    @Mutation(() => ArticleResponse)
    async editArticle(
        @Ctx() { prisma }: Context,
        @Arg('articleId') id: number,
        @Arg('options') options: EditArticleInput
    ) {
        try {
            const article = await prisma.article.update({
                where: { id },
                data: { ...options }
            });

            return article;
        } catch (error) {
            return useUnknownError('An unknown error has occurred.');
        }
    }

    @Mutation(() => Boolean)
    async deleteArticle(
        @Ctx() { prisma }: Context,
        @Arg('articleId') id: number
    ) {
        try { 
            await prisma.article.delete({
                where: { id }
            });
        } catch (error) {
            return false;
        }

        return true;
    }
}