import AccountResolver from './accountResolver/accountResolver';
import PlayerResolver from './playerResolver/playerResolver';
import FixtureResolver from './fixtureResolver/fixtureResolver';
import { ClubResolver } from './clubResolver/clubResolver';

export const resolvers: [Function, ...Array<Function>] = [ 
    AccountResolver, 
    PlayerResolver,
    ClubResolver,
    FixtureResolver
];