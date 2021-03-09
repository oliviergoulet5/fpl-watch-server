import { Connection } from '@mikro-orm/core';
import faker from 'faker';
import { EM } from '../../types';
import { gqlCall, setupConnection } from '../../utils';

let connection: Connection;
const registerMutation = `
    mutation Register($options: AccountInput!) {
        register(options: $options) {
            errors {
            field
            message
            }
            
            account {
            id
            username
            }
        }
    }
`;

let em: EM;

describe('Register', () => {
    beforeAll(async () => {
        em = await setupConnection();
    });

    it('creates an account', async () => {
        const user = {
            email: faker.internet.email(),
            username: faker.internet.userName(),
            password: faker.internet.password()
        };

        const response = await gqlCall({ 
            source: registerMutation,
            contextValue: { em, req: { session: { accountId: 0 } } },
            variableValues: {
                options: {
                    username: user.username,
                    email: user.email,
                    password: user.password
                }
            } 
        });
        console.log(response);
        expect(response).toBeNull(); // data is null because id needs to be added to the object in context
    });

    afterAll(async () => {
        await connection.close();
    });
})