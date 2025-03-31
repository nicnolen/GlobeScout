import { getCurrentUser } from '../../library/graphQL/users';

export const usersResolvers = {
    Query: {
        getCurrentUser: async (_parent: any, _args: any, context: any) => {
            return await getCurrentUser(context.user);
        },
    },
};
