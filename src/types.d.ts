import {FPLDataSource} from './FPLDataSource';

export type EntityManagerContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>   
}

export type FPLAPI = FPLDataSource;

export type Context = {
    dataSources: {
        fplAPI: FPLAPI
    },
    em: EntityManagerContext
}