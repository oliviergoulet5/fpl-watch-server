import { Context } from 'src/types';
import { Arg, Ctx, Query, Resolver} from 'type-graphql';
import Player from '../../entities/Player';
import {InputRange, InputRangeDouble}  from '../../entities/Range';

@Resolver()
class PlayerResolver {
    @Query(() => [Player])
    players(
        @Ctx() { dataSources: { fplAPI } }: Context,
        @Arg("goalsScored",()=>InputRange,{nullable:true}) goalsScored?:InputRange, 
        @Arg("assists",()=>InputRange,{nullable:true}) assists?:InputRange,
        @Arg("ict_index",()=>InputRangeDouble,{nullable:true}) ict_index?:InputRangeDouble,
        )
    
    : Promise<Player[]> 
    {
        return fplAPI.getPlayers({goalsScored,assists,ict_index});
    }
}

export default PlayerResolver;
