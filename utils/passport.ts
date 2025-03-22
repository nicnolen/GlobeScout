// src/config/passport.ts
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/users/Users';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || '';

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined.');
}

passport.use(
    new JwtStrategy(
        {
            secretOrKey: JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from the Authorization header
        },
        async (jwtPayload: any, done: (err: any, user?: any) => void) => {
            try {
                const user = await User.findById(jwtPayload.id); // Find user by the id in the JWT payload
                if (user) {
                    return done(null, user); // Successfully authenticated
                } else {
                    return done(null, false); // Authentication failed
                }
            } catch (err) {
                return done(err, false);
            }
        },
    ),
);

export default passport;
