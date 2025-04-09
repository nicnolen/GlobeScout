import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import UserModel from '../models/users/Users';
import { User } from '../types/users';
import dotenv from 'dotenv';
import { catchErrorHandler } from './errorHandlers';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined.');
}

interface Request {
    cookies: { [key: string]: string };
}

interface JwtPayload {
    id: string;
}

const cookieExtractor = (req: Request) => {
    return req.cookies ? req.cookies['accessToken'] : null;
};

passport.use(
    new JwtStrategy(
        {
            secretOrKey: JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]), // Extract JWT from the cookie
        },
        async (jwtPayload: JwtPayload, done: (err: unknown, user: User | false) => void) => {
            try {
                const user = await UserModel.findById(jwtPayload.id); // Find user by the id in the JWT payload
                if (user) {
                    return done(null, user); // Successfully authenticated
                } else {
                    return done(null, false); // Authentication failed
                }
            } catch (err: unknown) {
                const customMessage = 'Error setting up passport JWT';
                catchErrorHandler(err, customMessage);
                return done(err, false);
            }
        },
    ),
);

export default passport;
