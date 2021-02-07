import { RESTDataSource } from 'apollo-datasource-rest';
import fetch from 'node-fetch';

export class FPLDataSource extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://fantasy.premierleague.com/api/bootstrap-static/';
    }

    playerReducer(player: any) {
        return {
            firstName: player.first_name,
            lastName: player.second_name,
            minutes: player.minutes,
            goalsScored: player.goals_scored,
            bonus: player.bonus,
            bps: player.bps,
            yellowCards: player.yellow_cards,
            redCards: player.red_cards,
            ictIndex: player.ict_index,
            
        }
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