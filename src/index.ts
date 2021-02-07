import 'reflect-metadata';

import express from 'express';
import { ApolloServer, IResolvers } from 'apollo-server-express';

import {FPLDataSource} from './FPLDataSource';
import typeDefs from './typeDefs';

const resolvers: IResolvers = {
    Query: {
        players: async (_, __, { dataSources }) => dataSources.fplAPI.getPlayers()
    }
};

const main = async () => {
    const app = express();
    
    const apolloServer = new ApolloServer({ 
        typeDefs,
        resolvers,
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