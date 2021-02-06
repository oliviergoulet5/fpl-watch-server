import dotenv from 'dotenv';
dotenv.config();

import { __prod__ } from '../constants';
import { Account } from '../entities/Account';
import { MikroORM } from '@mikro-orm/core';
import path from 'path';

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
} as Parameters<typeof MikroORM.init>[0];
