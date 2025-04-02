import { GraphQLError } from 'graphql';
import { UserData } from '../../types/users';
import Users, { UsersDocument } from '../../models/users/Users';
import { catchErrorHandler } from '../../utils/errorHandlers';

export async function getCurrentUser(user: UsersDocument | null): Promise<UserData> {
    try {
        if (!user) {
            throw new GraphQLError('User not authenticated', {
                extensions: { code: 'UNAUTHENTICATED' },
            });
        }

        if (!user.active) {
            throw new GraphQLError('User account is inactive', {
                extensions: { code: 'FORBIDDEN' },
            });
        }

        return {
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin,
            active: user.active,
            authentication: user.authentication,
            services: user.services,
        };
    } catch (err: unknown) {
        const customMessage = 'Error fetching places from Google Maps text search';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}

export async function getAllUsers(): Promise<UserData[]> {
    try {
        const users = await Users.find();
        return users.map((user) => ({
            email: user.email,
            role: user.role,
            lastLogin: user.lastLogin,
            active: user.active,
            authentication: user.authentication,
            services: user.services,
        }));
    } catch (err: unknown) {
        catchErrorHandler(err, 'Error fetching users');
        throw err;
    }
}
