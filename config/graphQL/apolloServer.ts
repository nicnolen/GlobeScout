import { ApolloServer } from '@apollo/server';
import { typeDefs } from '../../graphQL/queries/index';
import { resolvers } from '../../graphQL/resolvers/index';
import { errorHandler } from '../../utils/errorHandler';

// Initialize Apollo Server with typeDefs and resolvers
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

export async function startApolloServer(): Promise<ApolloServer> {
    try {
        await apolloServer.start();
        console.info('Apollo server successfully started');
        return apolloServer;
    } catch (err: unknown) {
        const customMessage = 'Error starting Apollo Server';
        errorHandler(err, customMessage);
        throw err;
    }
}
