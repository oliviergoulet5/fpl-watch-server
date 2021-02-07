import { Field, Int, ObjectType, Float } from 'type-graphql';

@ObjectType()
class Player {
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field(() => Int)
    goalsScored: number;
    
    @Field(() => Int)
    assists: number;

    @Field(() => Int)
    minutes: number;

    @Field(() => Int)
    yellowCards: number;

    @Field(() => Int)
    redCards: number;

    @Field(() => Float)
    ictIndex: string;

}

export default Player;