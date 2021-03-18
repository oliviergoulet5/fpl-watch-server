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
         let k: keyof Player & keyof (typeof options);
         

            for (k in options) {
               reducedPlayerArray = reducedPlayerArray.filter((player) => { 
                    if(options[k])
                    {
                     return options[k]!.min <= player[k] && options[k]!.max >= player[k]
                    }
                    else
                    {
                        return true;
                    }
                    }
                    )
            }
            return reducedPlayerArray;
             

        }
        
             else
             {
                return reducedPlayerArray;
             }
     

            }
        }
        
