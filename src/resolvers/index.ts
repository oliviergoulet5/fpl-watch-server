import AccountResolver from './accountResolver/accountResolver';
import PlayerResolver from './playerResolver/playerResolver';
import FixtureResolver from './fixtureResolver/fixtureResolver';

export const resolvers: [Function, ...Array<Function>] = [ 
    AccountResolver, 
    PlayerResolver,
    FixtureResolver 
];