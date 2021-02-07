import { RESTDataSource } from 'apollo-datasource-rest';

export class FPLDataSource extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://fantasy.premierleague.com/api/bootstrap-static/'
    }

    async getPlayers() {
        const { allResults } = await this.get('');
        return allResults.elements;
    }
}