import { RESTDataSource } from 'apollo-datasource-rest';
import { mergeSchemas } from 'apollo-server-express';
import Player from './entities/Player';
import Filters from './entities/Filters';


export class FPLDataSource extends RESTDataSource {
    constructor() {
        super();
        this.baseURL =
            'https://fantasy.premierleague.com/api/bootstrap-static/';
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

    async getPlayers(options:Filters) {
        const response = await this.get('', undefined, {
            headers: {
                'User-Agent': '',
            },
        });
        let reducedPlayerArray:Array<Player> = [];

        const playerArray = response.elements;
        
  
        if(Array.isArray(playerArray))
        {
            reducedPlayerArray=playerArray.map(player => this.playerReducer(player));
        }
        else
        {
            reducedPlayerArray=[];
        }
        if(options)
        {
            return reducedPlayerArray.filter(player =>player.goalsScored >= options.goalsScored.min && player.goalsScored <= options.goalsScored.max );
             

        }
        
             else
             {
                return reducedPlayerArray;
             }
     
    }
}
