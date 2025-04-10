import { GraphQLError } from 'graphql';
import { UserData, User, ServiceUsage, EditUserInput } from '../../types/users';
import UsersModel from '../../models/users/Users';
import { catchErrorHandler } from '../../utils/errorHandlers';

// Queries
export async function getCurrentUser(user: User | null): Promise<UserData> {
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

            // Filter out services that are empty objects
            const filteredServices: Record<string, ServiceUsage> = Object.fromEntries(
                Object.entries(user.services).filter(([_, value]) => {
                    return value && Object.values(value).some((v) => v != null);
                }),
            ) as Record<string, ServiceUsage>;

            return {
                email: user.email,
                role: user.role,
                lastLogin: user.lastLogin,
                active: user.active,
                authentication: authenticationWithoutSecret,
                services: filteredServices,
            };
        });
    } catch (err: unknown) {
        catchErrorHandler(err, 'Error fetching users');
        throw err;
    }
}

// Mutations
export async function editUser(email: string, input: EditUserInput): Promise<User> {
    try {
        // Handle service revocation: remove services that are set to null in input
        const updatedInput: Partial<EditUserInput> = { ...input };

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

export async function resetSingleApiCalls(email: string, service: string): Promise<User> {
    try {
        // Construct the dynamic path to the service's requestsMade field
        const servicePath = `services.${service}.requestsMade`;

        const updatedUser = await UsersModel.findOneAndUpdate({ email }, { $set: { [servicePath]: 0 } }, { new: true });

        if (!updatedUser) {
            throw new GraphQLError(`User with email ${email} not found`, {
                extensions: { code: 'NOT_FOUND' },
            });
        }

        return updatedUser;
    } catch (err: unknown) {
        const customMessage = 'Failed to reset API usage';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}

export async function deleteUser(email: string): Promise<User> {
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
