export type EntityManagerContext = {
    em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>   
}