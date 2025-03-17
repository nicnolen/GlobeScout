import express, { Express, Request, Response, RequestHandler } from 'express';
import next from 'next';
import path from 'path';
import dotenv from 'dotenv';
import { expressMiddleware } from '@apollo/server/express4';
import connectToMongoDB from './config/mongoDB/db';
import { startApolloServer } from './config/graphQL/apolloServer';
import { scheduleClearFiveDayForecastCache } from './utils/cron/weatherCrons';
import { scheduleClearTopTenPlacesCache } from './utils/cron/googleMapsCrons';
import { catchErrorHandler } from './utils/errorHandlers';

// Load environmental variables
dotenv.config();

const PORT: string | number = process.env.PORT || 3000;
const dev: boolean = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: './client' });
// Tell Express how to handle incoming requests to server Next.js pages
const handle = app.getRequestHandler();

// Connect to MongoDB
connectToMongoDB();

async function startServer(): Promise<void> {
    try {
        // Wait for Next.js to be ready;
        await app.prepare();

        const server: Express = express();

        const apolloServer = await startApolloServer();

        // Middleware to parse JSON requests before Apollo Server
        server.use(express.json());
        server.use(express.urlencoded({ extended: true })); // Handles form data

        // Explicitly cast Apollo's middleware as an Express RequestHandler
        const graphqlMiddleware = expressMiddleware(apolloServer) as unknown as RequestHandler;
        // Apply Apollo Server middleware to the Express app
        server.use('/graphql', graphqlMiddleware);

        // Serve static files from the `client/public` folder
        server.use(express.static(path.join(__dirname, 'client', 'public')));

        // Catch all route to handle Next.js pages
        server.get('*', (req: Request, res: Response) => {
            return handle(req, res);
        });

        // cron jobs
        scheduleClearFiveDayForecastCache();
        scheduleClearTopTenPlacesCache();

        server.listen(PORT, () => {
            console.info(`Server is running on http://localhost:${PORT}`);
            console.info(`GraphQL endpoint available at http://localhost:${PORT}/graphql`);
        });
    } catch (err: unknown) {
        const customMessage = 'Error starting server';
        catchErrorHandler(err, customMessage);
    }
}

startServer();
