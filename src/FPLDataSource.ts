import { RESTDataSource } from 'apollo-datasource-rest';
import Player from './entities/Player';
import { SocialMedia } from './entities/SocialMedia';
import { Club } from './entities/Club';
import Filters from './entities/Filters';
import CLUB_PROFILES from '../clubProfiles.json';

export class FPLDataSource extends RESTDataSource {
    constructor() {
        super();
        this.baseURL =
            'https://fantasy.premierleague.com/api/bootstrap-static/';
    }

    private getClubCrestLocation(clubCode: number): string {
        return `https://resources.premierleague.com/premierleague/badges/t${clubCode}.png`;
    }

    private getClubSocialMedia(shortName: keyof typeof CLUB_PROFILES) {
        console.log(CLUB_PROFILES[shortName])
    }

    clubReducer(club: any) {
        let c = new Club();
        c.name = club.name;
        c.shortName = club.short_name;
        c.points = club.points;

        c.strength = club.strength;
        c.strengthOverallHome = club.strength_overall_home;
        c.strengthOverallAway = club.strength_overall_away;
        c.strengthAttackHome = club.strength_attack_home;
        c.strengthAttackAway = club.strength_attack_away;
        c.strengthDefenceHome = club.strength_defence_home;
        c.strengthDefenceAway = club.strength_defence_away;

        c.crestLocation = this.getClubCrestLocation(club.code);

        c.socialMedia = new SocialMedia();
        c.socialMedia.facebook = 'yoyo';
        
        if (c.shortName in CLUB_PROFILES) {
            this.getClubSocialMedia(c.shortName as unknown as keyof typeof CLUB_PROFILES);
        }

        return c;
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
        p.ictIndex = player.ict_index;

        return p;
    }

    async getClubs(options: { shortName: string }): Promise<Club[]> {
        const response = await this.get('', undefined, {
            headers: {
                'User-Agent': '',
            },
        });
        
        let reducedClubArray: Array<Club> = [];
        let clubArray = response['teams'];

        if (Array.isArray(clubArray)) {
            reducedClubArray = clubArray.map(club => 
                this.clubReducer(club)
            );
        }

        if (options.shortName) {
            let club = reducedClubArray.find((club) => club.shortName === options.shortName);
            
            if (!club) {
                return [];
            }

            return [club];
        }

        return reducedClubArray;
    } 

    async getPlayers(options: Filters) {
        const response = await this.get('', undefined, {
            headers: {
                'User-Agent': '',
            },
        });

        let reducedPlayerArray: Array<Player> = [];

        const playerArray = response.elements;

        if (Array.isArray(playerArray)) {
            reducedPlayerArray = playerArray.map(player =>
                this.playerReducer(player)
            );
        } else {
            reducedPlayerArray = [];
        }
        if (options) {
            let k: keyof Player & keyof typeof options;

            for (k in options) {
                reducedPlayerArray = reducedPlayerArray.filter(player => {
                    if (options[k]) {
                        return (
                            options[k]!.min <= player[k] &&
                            options[k]!.max >= player[k]
                        );
                    } else {
                        return true;
                    }
                });
            }
            return reducedPlayerArray;
        } else {
            return reducedPlayerArray;
        }
    }
}
