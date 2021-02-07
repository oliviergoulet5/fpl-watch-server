import 'reflect-metadata';

import { AccountResolver } from './resolvers/account';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { MikroORM } from '@mikro-orm/core';
import microConfig from './mikro-orm.config'

import {FPLDataSource} from './FPLDataSource';
import { PlayerResolver } from './resolvers/player';

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();
    
    const apolloServer = new ApolloServer({ 
        schema: await buildSchema({
            resolvers: [AccountResolver, PlayerResolver],
            validate: false,
        }),
        dataSources: () => {
            return {
                fplAPI: new FPLDataSource()
            }
        },
        context: () => ({ em: orm.em })
    });

    apolloServer.applyMiddleware({ app });
    

    app.listen(4332, () => {
        console.log('Server started on 4332')
    });
};

main().catch(err => console.log(err));