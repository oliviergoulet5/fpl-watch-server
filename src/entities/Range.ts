import { Field, ObjectType,Int, InputType } from "type-graphql";

@ObjectType()
export class Range{
    @Field(()=>Int)
    min:number
    @Field(()=>Int)
    max:number
}
@InputType()
export class InputRange{
    @Field(()=>Int)
    min:number
    @Field(()=>Int)
    max:number
}