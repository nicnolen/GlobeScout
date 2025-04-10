import { getCurrentUser, getAllUsers, editUser, deleteUser, resetSingleApiCalls } from '../../library/graphQL/users';
import { Context } from '../../types/graphQLContext';
import { EditUserProps, DeleteUserProps, ResetSingleApiCallsProps } from '../../types/users';
import { catchErrorHandler } from '../../utils/errorHandlers';

export const usersResolvers = {
    Query: {
        getCurrentUser: async (_parent: unknown, _args: unknown, context: Context) => {
            try {
                return await getCurrentUser(context.user);
            } catch (err: unknown) {
                const customMessage = 'Error fetching current user';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
        getAllUsers: async () => {
            try {
                return await getAllUsers();
            } catch (err: unknown) {
                const customMessage = 'Error fetching all users';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
    },

    Mutation: {
        editUser: async (_parent: unknown, { email, input }: EditUserProps) => {
            try {
                return await editUser({ email, input });
            } catch (err: unknown) {
                const customMessage = 'Error editing user';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
        deleteUser: async (_parent: unknown, { email }: DeleteUserProps) => {
            try {
                return await deleteUser({ email });
            } catch (err: unknown) {
                const customMessage = 'Error deleting user';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
        resetSingleApiCalls: async (_parent: unknown, { email, service }: ResetSingleApiCallsProps) => {
            try {
                return await resetSingleApiCalls({ email, service });
            } catch (err: unknown) {
                const customMessage = 'Error resetting API calls';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
    },
};
