import { Context } from '../types';
import { ObjectType, Field, Int, Ctx } from 'type-graphql';
import { Account } from '../entities/Account';

@ObjectType()
export class Comment {
    @Field(() => Int)
    id: number;

    @Field()
    content: string;

    @Field(() => Boolean)
    edited: boolean;

    @Field(() => String)
    date: Date;

    @Field(() => [Account], { nullable: 'items' })
    likedBy: Account[];

    @Field(() => [Account], { nullable: 'items' })
    dislikedBy: Account[];

    parentId?: number;

    @Field(() => Comment, { nullable: true })
    async parent(
        @Ctx() { prisma }: Context
    ) {
        const parentComment = await prisma.comment.findUnique({
            where: { id: this.parentId }
        });

        return parentComment;
    }

    @Field(() => [Comment], { nullable: 'items' })
    replies: Comment[];

    fromId: number;

    @Field(() => Account)
    async from(
        @Ctx() { prisma }: Context
    ) {
        const account = await prisma.account.findUnique({
            where: { id: this.fromId }
        });

        return account;
    }
}