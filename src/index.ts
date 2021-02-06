import 'reflect-metadata';

import { HelloResolver } from './resolvers/hello';
import { AccountResolver } from './resolvers/account';

import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';

import { MikroORM } from '@mikro-orm/core';
import microConfig from './mikro-orm.config'

const main = async () => {
    const orm = await MikroORM.init(microConfig);
    await orm.getMigrator().up();

    const app = express();
    
    const apolloServer = new ApolloServer({ 
        schema: await buildSchema({
            resolvers: [HelloResolver, AccountResolver],
            validate: false
        }),
        context: () => ({ em: orm.em })
    });

    apolloServer.applyMiddleware({ app });
    

    app.listen(4332, () => {
        console.log('Server started on 4332')
    });
};

main().catch(err => console.log(err));

// remember: yarn watch all time; delete migrations in ts and js; create migrations with npx; then run yarn dev
// const account = orm.em.create(Account, {username: 'johndoe', password: 'password'} );
// await orm.em.persistAndFlush(account);