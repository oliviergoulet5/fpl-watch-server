import { Article } from "../../entities/Article";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Context } from "../../types";
import { useUnknownError } from '../../utils/errors';
import { EditArticleInput, ArticleInput, ArticleResponse } from './articleTypes';
import { CommentInput, CommentResponse } from './commentTypes';
import { Prisma } from '@prisma/client';

const commentSelect: Prisma.articleInclude = {
    comments: {
        include: {
            likedBy: true,
            dislikedBy: true,
            article: true,
            from: true,
            parent: true,
            replies: true
        },
        where: {
            parentId: null
        }
    }
}

@Resolver()
export class ArticleResolver {
    @Query(() => [Article])
    async articles(
        @Ctx() { prisma }: Context,
        @Arg('id', { nullable: true }) id?: number
    ) {
        const articles = prisma.article.findMany({
            where: { id },
            include: { ...commentSelect, author: true }, 
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

            return { article };
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
                data: { ...options },
                include: { ...commentSelect, author: true }
            });

            return { article };
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

    @Mutation(() => CommentResponse)
    async postComment(
        @Ctx() { prisma, req }: Context,
        @Arg('articleId') id: number,
        @Arg('options') options: CommentInput
    ) {
        try {
            if (!req.session.accountId) return useUnknownError('Not authenticated.');

            const account = await prisma.account.findUnique({
                where: { id: req.session.accountId }
            });

            if (!account) {
                return useUnknownError('Account not found.')
            }

            const comment = await prisma.comment.create({
                data: {
                    fromId: account.id,
                    articleId: id,
                    ...options
                },
                include: {
                    likedBy: true,
                    dislikedBy: true,
                    article: true,
                    from: true,
                    parent: true,
                    replies: true
                }
            });

            return { comment };
        } catch (error) {
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