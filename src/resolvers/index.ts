import AccountResolver from './accountResolver/accountResolver';
import PlayerResolver from './playerResolver/playerResolver';
import FixtureResolver from './fixtureResolver/fixtureResolver';
import { ClubResolver } from './clubResolver/clubResolver';
import { ArticleResolver } from './articleResolver/articleResolver';

export const resolvers: [Function, ...Array<Function>] = [ 
    AccountResolver, 
    PlayerResolver,
    ClubResolver,
    FixtureResolver,
    ArticleResolver
];