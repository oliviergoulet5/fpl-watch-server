import { RESTDataSource } from 'apollo-datasource-rest';
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
        p.assists = player.assists;
        p.yellowCards = player.yellow_cards;
        p.ict_index = player.ict_index;

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
        

  
        if (Array.isArray(playerArray)) {
            reducedPlayerArray = playerArray.map(player => this.playerReducer(player));
            console.log(reducedPlayerArray);
        } else {
            reducedPlayerArray=[];
        }

        return reducedPlayerArray.filter(player => 
            (
                options.goalsScored 
                    && player.goalsScored>=options.goalsScored.min 
                    && player.goalsScored<=options.goalsScored.max
            )
            &&
            (
                options.assists 
                    && player.assists>=options.assists.min 
                    && player.assists<=options.assists.max
            )
            &&
            (
                options.ict_index
                    &&player.ict_index>=options.ict_index.min
                    &&player.ict_index<=options.ict_index.max
        ));
        
    }
}
