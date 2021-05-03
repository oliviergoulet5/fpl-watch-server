import { Arg, Ctx, Query, Resolver } from 'type-graphql';
import { Context } from 'src/types';
import { Club } from '../../entities/Club';

Resolver()
export class ClubResolver {
    @Query(() => [Club])
    clubs(
        @Ctx() { dataSources: { fplAPI }}: Context
    ): Promise<Club[]> {
        return fplAPI.getClubs({});
    }

    @Query(() => Club)
    async club(
        @Ctx() { dataSources: { fplAPI }}: Context,
        @Arg('shortName', () => String)
        shortName: string  
    ): Promise<Club> {
        let response = await fplAPI.getClubs({ shortName });
        return response[0];
    }
}