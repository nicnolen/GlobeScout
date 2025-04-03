import { getCurrentUser, getAllUsers, editUser, deleteUser } from '../../library/graphQL/users';

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
    },
};
