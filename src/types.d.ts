import FPLDataSource from './FPLDataSource';
import { Request, Response, Express } from 'express';
import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';

export type Context = {
    dataSources: {
        fplAPI: FPLDataSource;
    },
    req: Request & { session: Express.Session },
    res: Response,
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>> 
};