import FPLDataSource from './FPLDataSource';
import { Request, Response, Express } from 'express';
import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { FixtureDataSource } from './FixtureDataSource';

export type Context = {
    dataSources: {
        fplAPI: FPLDataSource;
        fixtureApi: FixtureDataSource;
    };
    req: Request & { session: Express.Session };
    res: Response;
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;

    req: Request & { session: Express.Session };
    res: Response;
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};
