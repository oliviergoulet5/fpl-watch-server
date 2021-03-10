import { Ctx, Query, Resolver } from 'type-graphql';
import { Context } from 'src/types';
import Fixture from '../../entities/Fixture';

@Resolver()
class FixtureResolver {
    @Query(() => [Fixture])
    fixtures(
        @Ctx() { dataSources: { fixtureApi } }: Context
    ): Promise<Fixture[]> {
        return fixtureApi.getFixtures();
    }
}

export default FixtureResolver;
