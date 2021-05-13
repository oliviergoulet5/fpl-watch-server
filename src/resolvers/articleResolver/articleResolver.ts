import { Article } from "../../entities/Article";
import { Arg, Ctx, Field, InputType, Mutation, Query, Resolver, Int, ObjectType } from "type-graphql";
import { Context } from "../../types";
import { useUnknownError } from '../../utils/errors';
import { EditArticleInput, ArticleInput, ArticleResponse } from './articleTypes';
import { Comment } from '../../entities/Comment';
import { CommentInput } from './commentTypes';

@Resolver()
export class ArticleResolver {
    @Query(() => [Article])
    async articles(
        @Ctx() { prisma }: Context,
        @Arg('id', { nullable: true }) id?: number
    ) {
        const articles = prisma.article.findMany({
            where: { id },
            include: { comments: true, author: true }
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

    @Mutation(() => Comment)
    async postComment(
        @Ctx() { prisma }: Context,
        @Arg('articleId') id: number,
        @Arg('options') options: CommentInput
    ) {
        try {
            const comment = await prisma.comment.create({
                data: {
                    fromId: 1, // userid
                    articleId: id,
                    ...options
                }
            });

            await prisma.article.findUnique({
                where: { id },
                include: {
                    comments: true
                }
            });

            return comment;
        } catch (error) {
            console.error(error);
            return useUnknownError();
        }

    }
}

// Todo:
/*
comment.fromId and comment.from should be required
article.update has comments field but article.findUnique does not?

            const article = await prisma.article.findUnique({
                where: { id },
                include: {
                    comments: true
                }
            });
*/