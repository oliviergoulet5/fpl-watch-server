import { RESTDataSource } from 'apollo-datasource-rest';
import Player from './entities/Player';

export class FPLDataSource extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://fantasy.premierleague.com/api/bootstrap-static/';
    }

    playerReducer(player: any) {
        let p = new Player();
        p.firstName = player.first_name;
        p.lastName = player.second_name;
        p.minutes = player.minutes;
        p.goalsScored = player.goals_scored;
        p.redCards = player.red_cards;
        p.yellowCards = player.yellow_cards;
        p.ictIndex = player.ict_index;

        return p;
    }

    async getPlayers() {
        const response = await this.get('', undefined, {
            headers: {
                'User-Agent': ''
            }
        });

        const playerArray = response.elements;

        return Array.isArray(playerArray)
            ? playerArray.map((player) => this.playerReducer(player))
            : [];
    }
}