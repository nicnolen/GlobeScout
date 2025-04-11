import express, { Express, Request, Response, RequestHandler } from 'express';
import fs from 'fs';
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
import serverless from 'serverless-http';

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

// ⬇️ 1. Define and configure your Express app immediately
const server: Express = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());
server.use(passport.initialize());

// Routes before GraphQL
server.use('/', authRoutes);
server.use('/', twoFactorRoutes);

// Static files
server.use(express.static(path.join(__dirname, 'client', 'public')));

// ⬇️ 2. Apollo setup will still be async, call it after
startApolloServer().then((apolloServer) => {
    const graphqlMiddleware = expressMiddleware(apolloServer, {
        context: async ({ req }) => {
            const user = req.user as User | null;
            return {
                user,
                apiKeys: apiKeys || null,
                apiBaseUrls: apiBaseUrls || null,
            };
        },
    }) as unknown as RequestHandler;

    server.use('/graphql', passport.authenticate('jwt', { session: false }));
    server.use('/graphql', graphqlMiddleware);

    // Schedule cron jobs
    scheduleClearFiveDayForecastCache();
    scheduleClearTopTenPlacesCache();
    scheduleUpdateTopTenPlacesOpenNowStatus();

    if (dev) {
        const options = {
            key: fs.readFileSync('./private/private.key'),
            cert: fs.readFileSync('./private/cert.pem'),
        };
        https.createServer(options, server).listen(PORT, () => {
            console.info(`Server is running on https://localhost:${PORT}`);
        });
    }
});

// ⬇️ 3. Export the Lambda handler synchronously
module.exports.handler = serverless(server);
