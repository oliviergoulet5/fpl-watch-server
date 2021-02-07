import { RESTDataSource } from 'apollo-datasource-rest';

export class FPLDataSource extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://fantasy.premierleague.com/api/bootstrap-static/'
    }

    playerReducer(player: any) {
        return {
            firstName: player.first_name,
            lastName: player.second_name
        }
    }

    async getPlayers() {
        const { response } = await this.get('');
        console.log(response);
        return Array.isArray(response)
            ? response.map(player => this.playerReducer(player))
            : [];
    }
}