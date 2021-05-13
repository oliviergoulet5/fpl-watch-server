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
    @Field(() => Comment)
    comment: Comment

    @Field(() => Error)
    error: Error
}