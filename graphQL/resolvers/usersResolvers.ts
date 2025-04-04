import { getCurrentUser, getAllUsers, editUser, deleteUser, resetSingleApiCalls } from '../../library/graphQL/users';

export const usersResolvers = {
    Query: {
        getCurrentUser: async (_parent: unknown, _args: unknown, context: any) => {
            return await getCurrentUser(context.user);
        },
        getAllUsers: async () => {
            return await getAllUsers();
        },
    },

    Mutation: {
        editUser: async (_parent: unknown, args: { email: string; input: any }) => {
            return await editUser(args.email, args.input);
        },
        deleteUser: async (_parent: unknown, args: { email: string }) => {
            return await deleteUser(args.email);
        },
        resetSingleApiCalls: async (_parent: unknown, args: { email: string; service: string }) => {
            return await resetSingleApiCalls(args.email, args.service);
        },
    },
};
