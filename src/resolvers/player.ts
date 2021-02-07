import { Ctx, Query, Resolver } from 'type-graphql';
import Player from '../entities/Player';

@Resolver()
class PlayerResolver {
    @Query(() => [Player])
    players(@Ctx() { dataSources: { fplAPI }}: any): Promise<Player[]> {
        console.log('test');
        return fplAPI.getPlayers();
    }
}

export default PlayerResolver;