import express, { Request, Response } from 'express';
import next from 'next';
import path from 'path';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { typeDefs } from './client/src/graphQL/queries/index';
import { resolvers } from './client/src/graphQL/resolvers/index';
import dotenv from 'dotenv';

// Load environmental variables
dotenv.config();

const PORT: string | number = process.env.PORT || 3000;
const dev: boolean = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: './client' });
// Tell Express how to handle incoming requests to server Next.js pages
const handle = app.getRequestHandler();

// Initialize Apollo Server with typeDefs and resolvers
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
});

async function startServer(): Promise<void> {
    try {
        // Wait for Next.js to be ready;
        await app.prepare();

        const server: any = express();

        await apolloServer.start();

        // Middleware to parse JSON requests before Apollo Server
        server.use(express.json());
        server.use(express.urlencoded({ extended: true })); // Handles form data

        // Apply Apollo Server middleware to the Express app
        server.use('/graphql', expressMiddleware(apolloServer));

        // Serve static files from the `client/public` folder
        server.use(express.static(path.join(__dirname, 'client', 'public')));

        // Catch all route to handle Next.js pages
        server.get('*', (req: Request, res: Response) => {
            return handle(req, res);
        });

        server.listen(PORT, () => {
            console.info(`Server is running on http://localhost:${PORT}`);
            console.info(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
        });
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(`Error starting server: ${err.message}`);
        } else {
            console.error(`Error starting server: ${err}`);
        }
    }
}

startServer();
