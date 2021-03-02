import dotenv from 'dotenv';
dotenv.config();

import { __prod__ } from './constants';
import { Account } from './entities/Account';
import path from 'path';
import { Options } from '@mikro-orm/core';

export default {
    migrations: {
        path: path.join(__dirname, './migrations'),
        pattern: /^[\w-]+\d+\.[tj]s$/,
    },
    entities: [Account],
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    dbName: 'fplwatch',
    type: 'postgresql',
    debug: !__prod__
} as Options;//as Parameters<typeof MikroORM.init>[0];

// Change to Options exported from ORM instead of parameters<typeof ...>
