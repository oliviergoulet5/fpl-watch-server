import { ObjectType, InputType, Field } from 'type-graphql';
import FieldError from '../../entities/FieldError';
import { Account } from '../../entities/Account';

@ObjectType()
export class AccountResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Account, { nullable: true })
    account?: Account;
}

@InputType()
export class LoginInput {
    @Field()
    email: string;

    @Field()
    password: string;
}

@InputType()
export class RegisterInput extends LoginInput {
    @Field()
    username: string;
}

@InputType()
export class UpdateInput {
    @Field({ nullable: true }) // not yet implemented
    username?: string;

    @Field({ nullable: true }) // not yet implemented
    email?: string;

    @Field({ nullable: true }) // not yet implemented
    password?: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    bio?: string;

    @Field({ nullable: true })
    favouriteTeam?: string;
}