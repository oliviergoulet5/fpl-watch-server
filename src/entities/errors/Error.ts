import { ObjectType, Field } from 'type-graphql';
import { FieldError } from './FieldError';
import { FormError } from './FormError';

@ObjectType()
export class Error {
    @Field(() => FieldError, { nullable: true })
    fieldError?: FieldError;

    @Field(() => FormError, { nullable: true })
    formError?: FormError;
}