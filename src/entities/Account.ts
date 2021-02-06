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

    @Property()
    password!: string;

    @Field()
    @Property({ nullable: true })
    name: string;
} 
