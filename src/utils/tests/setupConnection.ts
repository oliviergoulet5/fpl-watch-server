import { MikroORM } from '@mikro-orm/core';
import config from '../../mikro-orm.config';

const testConfig = { 
    ...config, 
    dbName: 'fplwatch-test',
    debug: true 
};

export const setupConnection = async () => { 
    let mikroOrm = await MikroORM.init(testConfig);
    
    return mikroOrm.em;
};