import { getCurrentUser, getAllUsers, editUser, deleteUser } from '../../library/graphQL/users';

export const usersResolvers = {
    Query: {
        getCurrentUser: async (_parent: any, _args: any, context: any) => {
            return await getCurrentUser(context.user);
        },
        getAllUsers: async (_parent: any, _args: any, context: any) => {
            return await getAllUsers();
        },
    },

    Mutation: {
        editUser: async (_parent: any, _args: { email: string; input: any }, context: any) => {
            return await editUser(_args.email, _args.input);
        },
        deleteUser: async (_parent: any, _args: { email: string }, context: any) => {
            return await deleteUser(_args.email);
        },
    },
};
