import { GraphQLError } from 'graphql';
import { getCurrentUser, getAllUsers, editUser, deleteUser, resetSingleApiCalls } from '../../library/graphQL/users';
import { Context } from '../../types/graphQLContext';
import { EditUserProps, DeleteUserProps, ResetSingleApiCallsProps } from '../../types/users';
import { catchErrorHandler } from '../../utils/errorHandlers';

export const usersResolvers = {
    Query: {
        getCurrentUser: async (_parent: unknown, _args: unknown, context: Context) => {
            try {
                const user = context.user;

                return await getCurrentUser({ user });
            } catch (err: unknown) {
                const customMessage = 'Error fetching current user';
                const finalMessage = catchErrorHandler(err, customMessage);
                throw new GraphQLError(finalMessage);
            }
        },
        getAllUsers: async () => {
            try {
                return await getAllUsers();
            } catch (err: unknown) {
                const customMessage = 'Error fetching all users';
                const finalMessage = catchErrorHandler(err, customMessage);
                throw new GraphQLError(finalMessage);
            }
        },
    },

    Mutation: {
        editUser: async (_parent: unknown, { email, input }: EditUserProps) => {
            try {
                return await editUser({ email, input });
            } catch (err: unknown) {
                const customMessage = 'Error editing user';
                const finalMessage = catchErrorHandler(err, customMessage);
                throw new GraphQLError(finalMessage);
            }
        },
        deleteUser: async (_parent: unknown, { email }: DeleteUserProps) => {
            try {
                return await deleteUser({ email });
            } catch (err: unknown) {
                const customMessage = 'Error deleting user';
                const finalMessage = catchErrorHandler(err, customMessage);
                throw new GraphQLError(finalMessage);
            }
        },
        resetSingleApiCalls: async (_parent: unknown, { email, service }: ResetSingleApiCallsProps) => {
            try {
                return await resetSingleApiCalls({ email, service });
            } catch (err: unknown) {
                const customMessage = 'Error resetting API calls';
                const finalMessage = catchErrorHandler(err, customMessage);
                throw new GraphQLError(finalMessage);
            }
        },
    },
};
