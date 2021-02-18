import { Field, ObjectType } from "type-graphql";
import  Range  from "./Range";

@ObjectType() 
class Filters{
    @Field(()=>Range,{nullable:true})
    goalsScored?:Range
}

export default Filters;