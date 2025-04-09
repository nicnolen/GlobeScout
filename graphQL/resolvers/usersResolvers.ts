import { getCurrentUser, getAllUsers, editUser, deleteUser, resetSingleApiCalls } from '../../library/graphQL/users';
import { Context } from '../../types/graphQLContext';
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
        editUser: async (_parent: unknown, args: { email: string; input: any }) => {
            try {
                console.log(args.input, 'input');
                return await editUser(args.email, args.input);
            } catch (err: unknown) {
                const customMessage = 'Error editing user';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
        deleteUser: async (_parent: unknown, args: { email: string }) => {
            try {
                return await deleteUser(args.email);
            } catch (err: unknown) {
                const customMessage = 'Error deleting user';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
        resetSingleApiCalls: async (_parent: unknown, args: { email: string; service: string }) => {
            try {
                return await resetSingleApiCalls(args.email, args.service);
            } catch (err: unknown) {
                const customMessage = 'Error resetting API calls';
                catchErrorHandler(err, customMessage);
                throw err;
            }
        },
    },
};
