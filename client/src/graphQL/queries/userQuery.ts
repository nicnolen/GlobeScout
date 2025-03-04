export const GET_USER = `
    type User {
        id: ID!
        name: String!
        email: String!
    }

    # Query for fetching a user by ID
    type Query {
        getUser(id: ID!): User
    }

    # Mutation for creating a new user
    type Mutation {
        createUser(name: String!, email: String!): User
    }
`;
