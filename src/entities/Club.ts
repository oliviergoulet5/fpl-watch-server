import { Field, Int, ObjectType } from 'type-graphql';
import { SocialMedia } from './SocialMedia';

@ObjectType()
export class Club {
    @Field()
    name: string;

    @Field()
    shortName: string;

    @Field(() => Int)
    points: number;

    @Field()
    crestLocation: string;

    @Field(() => Int)
    strength: number;

    @Field(() => Int)
    strengthOverallHome: number;

    @Field(() => Int)
    strengthOverallAway: number;

    @Field(() => Int)
    strengthAttackHome: number;

    @Field(() => Int)
    strengthAttackAway: number;

    @Field(() => Int)
    strengthDefenceHome: number;

    @Field(() => Int)
    strengthDefenceAway: number;

    @Field(() => SocialMedia)
    socialMedia: SocialMedia;
}