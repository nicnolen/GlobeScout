import { ApolloServer } from '@apollo/server';
import { Context } from '../../types/graphQLContext';
import { typeDefs } from '../../graphQL/schema/index';
import { resolvers } from '../../graphQL/resolvers/index';
import { catchErrorHandler } from '../../utils/errorHandlers';

// Initialize Apollo Server with typeDefs and resolvers
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

export async function startApolloServer(): Promise<ApolloServer<Context>> {
    try {
        await apolloServer.start();
        console.info('Apollo server successfully started');
        return apolloServer;
    } catch (err: unknown) {
        const customMessage = 'Error starting Apollo Server';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}
