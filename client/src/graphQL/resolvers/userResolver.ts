type UserArgs = {
    id: string;
};

export const userResolver = {
    Query: {
        getUser: (_: unknown, { id }: UserArgs) => {
            return { id, name: 'John Doe', email: 'john@example.com' };
        },
    },
};
