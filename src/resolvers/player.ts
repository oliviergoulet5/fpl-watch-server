import { Context } from 'src/types';
import { Arg, Ctx, Query, Resolver,Int, ObjectType, Field} from 'type-graphql';
import Player from '../entities/Player';
import {Range,  InputRange}  from '../entities/Range';




@Resolver()
class PlayerResolver {
    @Query(() => [Player])
    players(
        @Ctx() { dataSources: { fplAPI } }: Context,
        @Arg("goalsScored",()=>InputRange,{nullable:true}) goalsScored?:InputRange
        )
    
    : Promise<Player[]> 
    {
        return fplAPI.getPlayers({goalsScored});
    }
}

export default PlayerResolver;
