import { Context } from '../types';
import { ObjectType, Field, Int, FieldResolver, Ctx } from 'type-graphql';
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

    @Field(() => [Account])
    likedBy: Account[];

    @Field(() => [Account])
    dislikedBy: Account[];

    @Field(() => Comment, { nullable: true })
    parent?: Comment;

    @Field(() => [Comment])
    replies: Comment[];

    fromId: number;

    @Field(() => Account, { nullable: true })
    async from(
        @Ctx() { prisma }: Context
    ) {
        const account = await prisma.account.findUnique({
            where: { id: this.fromId }
        });

        return account;
    }
}