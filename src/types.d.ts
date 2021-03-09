import FPLDataSource from './FPLDataSource';
import { Request, Response, Express } from 'express';
import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { Stream } from 'stream';

export type EM = EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;

export type Context = {
    dataSources: {
        fplAPI: FPLDataSource;
    };
    req: Request & { session: Express.Session };
    res: Response;
    em: EM;
};

// Not currently in use
export type Upload = {
    filename: string;
    mimetype: string;
    encoding: string;
    filetype: string;

    createReadStream: () => Stream;
}
