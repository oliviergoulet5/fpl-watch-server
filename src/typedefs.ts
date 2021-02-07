import { gql } from "apollo-server-express";

export default gql`
    type Player {
        firstName: String
        lastName: String
        minutes: Int
        goalsScored: Int
        bonus: Int
        bps: Int
        yellowCards: Int
        redCards: Int
        ictIndex: Float

    }

    type Query {
        players: [Player]!
    }
`;