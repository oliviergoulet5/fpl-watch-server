import AccountResolver from './accountResolver/accountResolver';
import PlayerResolver from './playerResolver/playerResolver';

export const resolvers: [Function, ...Array<Function>] = [ 
    AccountResolver, 
    PlayerResolver 
];