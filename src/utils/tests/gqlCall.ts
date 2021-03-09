import { graphql, GraphQLSchema } from 'graphql';
import { createSchema } from '../createSchema';

interface Options {
    source: string,
    variableValues?: any,
    contextValue?: any
}

let schema: GraphQLSchema;

export const gqlCall = async ({ source, variableValues, contextValue }: Options) => {
    if (!schema) {
        schema = await createSchema();
    }

    return graphql({
        schema,
        source,
        variableValues,
        contextValue
    });
}

