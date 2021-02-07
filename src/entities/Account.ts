import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class Account {
    @Field(() => Int)
    @PrimaryKey()
    id!: number;

    @Field()
    @Property({ length: 25, unique: true })
    username!: string;

    @Property({ type: 'text' })
    password!: string;

    @Field()
    @Property({ unique: true })
    email!: string;

    @Field({ nullable: true })
    @Property({ nullable: true })
    name?: string;

    @Field(() => String)
    @Property({ type: 'date'})
    createdAt = new Date();

    @Field(() => String)
    @Property({ type: 'date', onUpdate: () => new Date() })
    updatedAt = new Date();
} 