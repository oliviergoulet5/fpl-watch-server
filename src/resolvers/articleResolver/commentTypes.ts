import { InputType, Field, ObjectType, Int } from 'type-graphql';
import { Comment } from '../../entities/Comment';
import { Error } from '../../entities/errors';

@InputType()
export class CommentInput {
    @Field()
    content: string
    
    @Field(() => Int, { nullable: true })
    parentId?: number
}

@ObjectType()
export class CommentResponse {
    @Field(() => Comment, { nullable: true })
    comment: Comment

    @Field(() => Error, { nullable: true })
    error: Error
}