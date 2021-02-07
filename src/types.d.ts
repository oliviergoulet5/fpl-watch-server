import FPLDataSource from './FPLDataSource';
import { Request, Response } from 'express';

export type EntityManagerContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>,
    req: Request,
    res: Response,
};

export type Context = {
    dataSources: {
        fplAPI: FPLDataSource;
    },
    req: Request,
    res: Response,
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>> 
};

/*
export type EntityManagerContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};

export type Context = {
    dataSources: {
        fplAPI: FPLDataSource;
    };
};

*/