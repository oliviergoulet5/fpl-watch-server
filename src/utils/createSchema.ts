import { buildSchema } from "type-graphql";
import { resolvers } from '../resolvers';

export const createSchema = () => buildSchema({
    resolvers,
    validate: false
});