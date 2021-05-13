import { Context } from 'src/types';
import { Ctx, Field, Int, ObjectType } from 'type-graphql';
import { Account } from './Account';
import { Comment } from './Comment';

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

    @Field(() => Account, { nullable: true })
    async author(
        @Ctx() { prisma }: Context
    ) {
        const account = await prisma.account.findUnique({
            where: { id: this.authorId }
        });

        return account;
    }

    // Likes
    @Field(() => [Account], { defaultValue: [] })
    likedBy: Account[];

    dislikedBy: Account[];

    @Field(() => [Comment], { defaultValue: [] })
    comments: Comment[];
}