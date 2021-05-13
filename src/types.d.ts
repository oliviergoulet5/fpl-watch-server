import FPLDataSource from './FPLDataSource';
import FixtureDataSource from './FixtureDataSource';
import { Request, Response, Express } from 'express';
import { EntityManager, IDatabaseDriver, Connection } from '@mikro-orm/core';
import { Stream } from 'stream';
import { PrismaClient, account } from '@prisma/client';
import { Account } from './entities/Account';

export type Context = {
    dataSources: {
        fplAPI: FPLDataSource;
        fixtureApi: FixtureDataSource;
    };
    req: Request & { session: Express.Session };
    res: Response;
    prisma: PrismaClient;
};

// Not currently in use
export type Upload = {
    filename: string;
    mimetype: string;
    encoding: string;
    filetype: string;

    createReadStream: () => Stream;
}
