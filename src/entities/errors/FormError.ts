import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class FormError {
    @Field()
    message: string;
}