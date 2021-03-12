import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class UnverifiedAccount {
    @Field()
    email: string;

    username: string;

    password: string;
}