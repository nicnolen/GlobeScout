import { GraphQLError } from 'graphql';
import { UserData } from '../../types/users';
import UsersModel, { UsersDocument } from '../../models/users/Users';
import { catchErrorHandler } from '../../utils/errorHandlers';

// Queries
export async function getCurrentUser(user: UsersDocument | null): Promise<UserData> {
    try {
        if (!user) {
            throw new GraphQLError('User not authenticated', {
                extensions: { code: 'UNAUTHENTICATED' },
            });
        }

        const { email, role, lastLogin, active, authentication, services } = user;

        if (!active) {
            throw new GraphQLError('User account is inactive', {
                extensions: { code: 'FORBIDDEN' },
            });
        }

        const { authenticatorSecret, ...filteredAuth } = authentication;

        return {
            email: email,
            role: role,
            lastLogin: lastLogin,
            active: active,
            authentication: filteredAuth,
            services: services,
        };
    } catch (err: unknown) {
        const customMessage = 'Error fetching places from Google Maps text search';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}

export async function getAllUsers(): Promise<UserData[]> {
    try {
        const users = await UsersModel.find();

        return users.map((user) => {
            const { authenticatorSecret, ...authenticationWithoutSecret } = user.authentication;

            return {
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin,
                active: user.active,
                authentication: authenticationWithoutSecret,
                services: user.services,
            };
        });
    } catch (err: unknown) {
        catchErrorHandler(err, 'Error fetching users');
        throw err;
    }
}

// Mutations
export async function editUser(email: string, input: any): Promise<UsersDocument> {
    try {
        // Handle service revocation: remove services that are set to null in input
        const updatedInput: any = { ...input };
        if (input.services) {
            for (const service in input.services) {
                if (input.services[service] === null) {
                    // Remove revoked service from the update object
                    if (!updatedInput.services) updatedInput.services = {};
                    delete updatedInput.services[service];
                }
            }
        }

        // Perform the update
        const updatedUser = await UsersModel.findOneAndUpdate(
            { email },
            { $set: updatedInput }, // Use the modified input object
            { new: true, runValidators: true },
        );

        // Check if the user was found and updated
        if (!updatedUser) {
            throw new GraphQLError(`User with email ${email} not found`, {
                extensions: { code: 'NOT_FOUND' },
            });
        }

        return updatedUser;
    } catch (err: unknown) {
        const customMessage = 'Failed to edit user';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}

export async function deleteUser(email: string): Promise<UsersDocument | null> {
    try {
        const deletedUser = await UsersModel.findOneAndDelete({ email });

        if (!deletedUser) {
            throw new GraphQLError(`User with email ${email} not found`, {
                extensions: { code: 'NOT_FOUND' },
            });
        }

        return deletedUser;
    } catch (err: unknown) {
        const customMessage = 'Failed to delete user';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}
