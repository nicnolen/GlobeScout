import express, { Express, Request, Response, RequestHandler } from 'express';
import fs from 'fs';
import next from 'next';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import https from 'https';
import { expressMiddleware } from '@apollo/server/express4';
import { User } from './types/users';
import { Context } from './types/graphQLContext';
import passport from './utils/passport';
import connectToMongoDB from './config/mongoDB/db';
import { startApolloServer } from './config/graphQL/apolloServer';
import authRoutes from './routes/auth';
import twoFactorRoutes from './routes/2fa';
import { scheduleClearFiveDayForecastCache } from './utils/cron/weatherCrons';
import { scheduleClearTopTenPlacesCache, scheduleUpdateTopTenPlacesOpenNowStatus } from './utils/cron/googleMapsCrons';
import { catchErrorHandler } from './utils/errorHandlers';

// Load environmental variables
dotenv.config();

const PORT: string | number = process.env.PORT || 3000;
const dev: boolean = process.env.NODE_ENV !== 'production';
const app = next({ dev, dir: './client' });
// Tell Express how to handle incoming requests to server Next.js pages
const handle = app.getRequestHandler();

const apiKeys = {
    openWeatherApiKey: process.env.OPENWEATHER_API_KEY ?? null,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? null,
};

const apiBaseUrls = {
    openWeatherUrl: process.env.OPENWEATHER_BASE_URL ?? null,
    googleMapsTextSearchUrl: process.env.GOOGLE_MAPS_TEXT_SEARCH_URL ?? null,
};

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
        server.use(cookieParser()); // Enable cookies for authentication

        server.use(passport.initialize());

        // Apply passport to graphql
        server.use('/graphql', passport.authenticate('jwt', { session: false }));

        // Explicitly cast Apollo's middleware as an Express RequestHandler
        const graphqlMiddleware = expressMiddleware(apolloServer, {
            context: async ({ req }): Promise<Context> => {
                // Type assertion to match your custom User type
                const user = req.user as User | null;
                return {
                    user,
                    apiKeys: apiKeys || null,
                    apiBaseUrls: apiBaseUrls || null,
                };
            },
        }) as unknown as RequestHandler;
        // Apply Apollo Server middleware to the Express app
        server.use('/graphql', graphqlMiddleware);

        // Serve static files from the `client/public` folder
        server.use(express.static(path.join(__dirname, 'client', 'public')));

        // Routes
        server.use('/', authRoutes);
        server.use('/', twoFactorRoutes);

        // Catch all route to handle Next.js pages
        server.get(/(.*)/, (req: Request, res: Response) => {
            return handle(req, res);
        });

        // Cron jobs
        scheduleClearFiveDayForecastCache();
        scheduleClearTopTenPlacesCache();
        scheduleUpdateTopTenPlacesOpenNowStatus();

        // Start HTTPS server
        const options = {
            key: fs.readFileSync('./private/private.key'),
            cert: fs.readFileSync('./private/cert.pem'),
        };

        https.createServer(options, server).listen(PORT, () => {
            console.info(`Server is running on https://localhost:${PORT}`);
        });
    } catch (err: unknown) {
        const customMessage = 'Error starting server';
        catchErrorHandler(err, customMessage);
    }
}

startServer();
