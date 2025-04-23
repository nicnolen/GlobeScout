import express, { Express, RequestHandler } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import serverless from 'serverless-http';
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
import bodyParser from 'body-parser';
import cors from 'cors';

// Load environmental variables
dotenv.config();

const dev: boolean = process.env.NODE_ENV !== 'production';

const apiKeys = {
    openWeatherApiKey: process.env.OPENWEATHER_API_KEY ?? null,
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY ?? null,
};

const apiBaseUrls = {
    openWeatherUrl: process.env.OPENWEATHER_BASE_URL ?? null,
    googleMapsTextSearchUrl: process.env.GOOGLE_MAPS_TEXT_SEARCH_URL ?? null,
};

const server: Express = express();

// Connect to MongoDB
connectToMongoDB();

async function startServer(): Promise<void> {
    try {
        const apolloServer = await startApolloServer();

        // Raw parser for AWS Lambda payloads
        server.use(bodyParser.raw({ type: 'application/json' }));

        // Middleware to convert raw buffer into JSON (for Lambda/API Gateway compatibility)
        const bufferParserMiddleware: RequestHandler = (req, res, next) => {
            if (req.is('application/json') && Buffer.isBuffer(req.body)) {
                try {
                    req.body = JSON.parse(req.body.toString());
                } catch (err: unknown) {
                    const customMessage = 'Invalid JSON body';
                    catchErrorHandler(err, customMessage);
                    res.status(400).send('Invalid JSON body');
                    return; // Just return here to stop further processing
                }
            }
            next();
        };

        server.use(bufferParserMiddleware);

        // Middleware to parse JSON requests before Apollo Server
        server.use(express.json());
        server.use(express.urlencoded({ extended: true })); // Handles form data
        server.use(cookieParser()); // Enable cookies for authentication
        server.use(
            cors({
                origin: ['https://globe-scout.vercel.app', 'http://localhost:3000'],
                credentials: true,
            }),
        );

        server.use(passport.initialize());

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

        // Serve static files from the `client/public` folder
        server.use(express.static(path.join(__dirname, 'client', 'public')));

        // Routes
        server.use('/', authRoutes);
        server.use('/', twoFactorRoutes);

        // Only run cron jobs if we're in development (In lambda they will be ran on AWS Cloudwatch)
        if (dev) {
            // Cron jobs (These will run on AWS CloudWatch, no need for manual scheduling in Lambda)
            scheduleClearFiveDayForecastCache();
            scheduleClearTopTenPlacesCache();
            scheduleUpdateTopTenPlacesOpenNowStatus();
        }
    } catch (err: unknown) {
        const customMessage = 'Error starting server';
        catchErrorHandler(err, customMessage);
    }
}

startServer();

module.exports.handler = serverless(server);
