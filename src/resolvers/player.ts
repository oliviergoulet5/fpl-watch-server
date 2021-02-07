import { Field, ObjectType, Resolver, Query, Ctx, Int } from "type-graphql";
import { Context } from '../types';

import fetch from 'node-fetch';

type PlayerData = {
    first_name: string
    second_name: string
    minutes: number
    own_goals: number
    yellow_cards: number
    red_cards: number
}

@ObjectType()
export class Player {
    
    @Field()
    firstName: string;

    @Field()
    lastName: string;

    @Field(() => Int)
    minutes: number

    @Field(() => Int)
    ownGoals: number

    @Field(() => Int)
    yellowCards: number

    @Field(() => Int)
    redCards: number

    constructor(payload: Partial<Player>) {

    }
}

@Resolver()
export class PlayerResolver {
    @Query(() => [Player]) 
    async players(@Ctx() {dataSources: { fplAPI }}: Context): Promise<Player[]> {

        return await fplAPI.getPlayers();
    }

}