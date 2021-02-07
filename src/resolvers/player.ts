import { Field, ObjectType, Resolver, Query, Ctx, Int } from "type-graphql";
import {FPLDataSource} from '../FPLDataSource';
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
}

@Resolver()
export class PlayerResolver {
    @Query(() => [Player]) 
    async players(): Promise<Player[]> {
        
        const response = await fetch('https://fantasy.premierleague.com/api/bootstrap-static/', { headers: {'User-Agent': ''}});
        const allData = await response.json();
        const playerData = allData.elements;

        let players = new Array<Player>();
        playerData.forEach((data: PlayerData) => {
            let player = new Player();

            player.firstName = data.first_name;
            player.lastName = data.second_name;
            player.yellowCards = data.yellow_cards;
            player.redCards = data.red_cards;
            player.minutes = data.minutes;
            player.ownGoals = data.own_goals;
            
            players.push(player);
        });

        return players;
    }

}