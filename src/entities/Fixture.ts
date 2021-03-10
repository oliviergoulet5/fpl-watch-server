import { Field, ObjectType } from 'type-graphql';

@ObjectType()
class Fixture {
    @Field(() => String, { nullable: true })
    gameWeek?: string;

    @Field(() => String, { nullable: true })
    kickoffTime = new Date();

    @Field()
    teamAway: string;

    @Field()
    teamHome: string;
}

export default Fixture;
