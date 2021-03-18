import { ObjectType, InputType, Field } from 'type-graphql';
import { Error } from '../../entities/errors';
import { Account } from '../../entities/Account';
import { UnverifiedAccount } from '../../entities/UnverifiedAccount';


@ObjectType()
export class AccountResponse {
    @Field(() => Error, { nullable: true })
    error?: Error

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

@ObjectType()
export class UnverifiedAccountResponse {
    @Field(() => Error, { nullable: true })
    error?: Error;

    @Field(() => UnverifiedAccount, { nullable: true })
    unverifiedAccount?: UnverifiedAccount;
}