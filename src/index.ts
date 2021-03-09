import 'reflect-metadata';

import { ACCOUNT_COOKIE_NAME, __prod__ } from './constants';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import session from 'express-session';
import cors from 'cors';
import { graphqlUploadExpress } from 'graphql-upload';
import { ApolloServer } from 'apollo-server-express';

import * as pg from 'pg';
import connectPgSimple from 'connect-pg-simple';
const pgSession = connectPgSimple(session);


import { MikroORM } from '@mikro-orm/core';
import microConfig from './mikro-orm.config';
import { Context } from './types';
import { createSchema } from './utils';

import { FPLDataSource } from './FPLDataSource';

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();

    app.use(
        cors({
            origin: 'http://localhost:3000',
            credentials: true,
        })
    );

    app.use(graphqlUploadExpress({ maxFileSize: 10000, maxFiles: 1 }));

    app.use(
        session({
            name: ACCOUNT_COOKIE_NAME,
            store: new pgSession({
                pool: new pg.Pool({
                    connectionString: `postgres://${process.env.DB_USER}:${process.env.DB_PASS}@localhost:5432/fplwatch`,
                }),
                tableName: 'user_session',
            }),
            secret: process.env.COOKIE_SECRET as string,
            resave: false,
            saveUninitialized: false,
            cookie: {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: __prod__, // only works in https
                sameSite: 'lax',
            },
        })
    );

    const apolloServer = new ApolloServer({
        schema: await createSchema(), 
        uploads: false,
        dataSources: () => {
            return {
                fplAPI: new FPLDataSource(),
            };
        },
        context: ({ req, res }): Partial<Context> => ({ em: orm.em.fork(), req, res }), //Partial<Context>
    });

    apolloServer.applyMiddleware({ app, cors: false });

    app.listen(4332, () => {
        console.log('Server started on 4332');
    });
};

main().catch(err => console.log(err));
