import { Field, ObjectType, Int, InputType, Float } from 'type-graphql';

@ObjectType()
export class Range {
    @Field(() => Int)
    min: number;
    @Field(() => Int)
    max: number;
}
@ObjectType()
export class DoubleRange {
    @Field(() => Float)
    min: number;
    @Field(() => Float)
    max: number;
}

@InputType()
export class InputRange {
    @Field(() => Int)
    min: number;
    @Field(() => Int)
    max: number;
}

@InputType()
export class InputRangeDouble {
    @Field(() => Float)
    min: number;
    @Field(() => Float)
    max: number;
}
