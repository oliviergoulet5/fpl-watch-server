import { RESTDataSource } from 'apollo-datasource-rest';
import Fixture from './entities/Fixture';

export class FixtureDataSource extends RESTDataSource {
    constructor() {
        super();
        this.baseURL = 'https://fantasy.premierleague.com/api/fixtures';
    }
    fixtureReducer(fixture: any) {
        let f = new Fixture();
        f.gameWeek = fixture.event;
        f.kickoffTime = fixture.kickoff_time;
        f.teamAway = fixture.team_a;
        f.teamHome = fixture.team_h;
        return f;
    }
    async getFixtures(): Promise<Fixture[]> {
        const response = await this.get('', undefined, {
            headers: {
                'User-Agent': '',
            },
        });
        console.log(response);
        const fixtureArray = response;

        return Array.isArray(fixtureArray)
            ? fixtureArray.map(fixture => this.fixtureReducer(fixture))
            : [];
    }
}
