import express, { Express, RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import https from 'https';
import { GraphQLError } from 'graphql';
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
import serverless from 'serverless-http';
import cors from 'cors';

// Load environmental variables
dotenv.config();

const PORT: string | number = process.env.PORT || 3000;
const dev: boolean = process.env.NODE_ENV !== 'production';

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
const server: Express = express();

// CORS Configuration to allow requests from your Vercel frontend
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];

server.use(
    cors({
        origin: allowedOrigins, // Only allow requests from your frontend
        credentials: true, // If you're sending cookies or sessions, this is needed
    }),
);

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(passport.initialize());

// Routes before GraphQL
server.get('/', (req, res) => {
    res.send('Welcome to the API');
});

server.use('/', authRoutes);
server.use('/', twoFactorRoutes);

// Static files
server.use(express.static(path.join(__dirname, 'client', 'public')));
startApolloServer().then((apolloServer) => {
    try {
        // Apply passport to graphql
        server.use('/graphql', passport.authenticate('jwt', { session: false }));

        // Explicitly cast Apollo's middleware as an Express RequestHandler
        const graphqlMiddleware = expressMiddleware(apolloServer, {
            context: async ({ req }): Promise<Context> => {
                // Type assertion to match your custom User type
                const user = req.user as User | null;

                if (!user) {
                    throw new GraphQLError('User not authenticated', {
                        extensions: { code: 'UNAUTHENTICATED' },
                    });
                }

                return {
                    user,
                    apiKeys: apiKeys || null,
                    apiBaseUrls: apiBaseUrls || null,
                };
            },
        }) as unknown as RequestHandler;
        // Apply Apollo Server middleware to the Express app
        server.use('/graphql', graphqlMiddleware);

        if (dev) {
            // Cron jobs
            scheduleClearFiveDayForecastCache();
            scheduleClearTopTenPlacesCache();
            scheduleUpdateTopTenPlacesOpenNowStatus();

            // Start HTTPS server if not in Lambda environment
            const options = {
                key: fs.readFileSync('./private/private.key'),
                cert: fs.readFileSync('./private/cert.pem'),
            };
            https.createServer(options, server).listen(PORT, () => {
                console.info(`Server is running on https://localhost:${PORT}`);
            });
        }
    } catch (err: unknown) {
        const customMessage = 'Error starting server';
        catchErrorHandler(err, customMessage);
    }
});

// Export the Lambda handler synchronously
module.exports.handler = serverless(server);
