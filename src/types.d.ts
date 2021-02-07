import FPLDataSource from './FPLDataSource';

export type EntityManagerContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};

export type Context = {
    dataSources: {
        fplAPI: FPLDataSource;
    };
};
