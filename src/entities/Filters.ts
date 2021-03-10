import { Field, ObjectType } from "type-graphql";
import  {DoubleRange, Range}  from "./Range";

@ObjectType() 
class Filters{
    @Field(()=>Range,{nullable:true})
    goalsScored?:Range
    @Field(()=>Range,{nullable: true})
    assists?:Range 
    @Field(()=>DoubleRange,{nullable: true})
    ict_index?:DoubleRange
}

export default Filters;