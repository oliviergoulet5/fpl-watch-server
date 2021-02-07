import 'reflect-metadata';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import {FPLDataSource} from './FPLDataSource';
import PlayerResolver from './resolvers/player';

const main = async () => {
    const app = express();
    
    const apolloServer = new ApolloServer({ 
        schema: await buildSchema({
            resolvers: [PlayerResolver],
            validate: false
        }),
        dataSources: () => {
            return {
                fplAPI: new FPLDataSource()
            }
        }
    });

    apolloServer.applyMiddleware({ app });
    
    app.listen(4332, () => {
        console.log('Server started on 4332')
    });
};

main().catch(err => console.log(err));