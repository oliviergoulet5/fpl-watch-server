import 'reflect-metadata';

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';

import * as pg from "pg";
import connectPgSimple from 'connect-pg-simple';

import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { MikroORM } from '@mikro-orm/core';
import microConfig from './mikro-orm.config';

import AccountResolver from './resolvers/account';

import { FPLDataSource } from './FPLDataSource';
import PlayerResolver from './resolvers/player';
import { __prod__ } from './constants';

import { EntityManagerContext } from './types';


const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    const pgSession = connectPgSimple(session);
    const store: session.Store = new pgSession({
        pool: new pg.Pool({
            connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:5432/fplwatch`
        }),
        tableName: 'user_session',
    });

    app.use(session({
        store,
        secret: process.env.COOKIE_SECRET as string,
        resave: false,
        saveUninitialized: false,
        cookie: { 
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            secure: __prod__, // only works in https
            sameSite: 'lax'
        }
    }))

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [AccountResolver, PlayerResolver],
            validate: false,
        }),
        dataSources: () => {
            return {
                fplAPI: new FPLDataSource(),
            };
        },
        context: ({ req, res }): EntityManagerContext => ({ em: orm.em, req, res }), //Partial<Context>
    });

    apolloServer.applyMiddleware({ app });

    app.listen(4332, () => {
        console.log('Server started on 4332');
    });
};

main().catch(err => console.log(err));
