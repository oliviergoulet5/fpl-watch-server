import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
export class Account {
    @Field(() => Int)
    id!: number;

    @Field()
    username!: string;

    password!: string;

    @Field()
    email!: string;

    @Field({ nullable: true })
    name?: string;

    @Field({ nullable: true })
    bio?: string;
    
    @Field({ nullable: true })
    favouriteTeam?: string;

    @Field({ nullable: true })
    avatarLocation?: string;

    @Field(() => String)
    createdAt = new Date();

    @Field(() => String)
    updatedAt = new Date();
}
