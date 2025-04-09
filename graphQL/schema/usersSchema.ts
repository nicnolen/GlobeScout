export const GET_USERS = `
  type AuthMethods {
    email: Boolean
    authenticator: Boolean
  }

  type Authentication {
    enabled: Boolean!
    methods: AuthMethods!
  }

  type ServiceUsage {
    requestsMade: Int
    maxRequests: Int
  }

  type Services {
    openWeatherApi: ServiceUsage
    googleMapsApi: ServiceUsage
  }

  type User {
    email: String!
    role: String!
    lastLogin: String!
    active: Boolean!
    authentication: Authentication!
    services: Services!
  }

  type Query {
    getCurrentUser: User
    getAllUsers: [User]
  }
`;

export const EDIT_USERS = `
  input AuthMethodsInput {
    email: Boolean
    authenticator: Boolean
  }

  input AuthenticationInput {
    enabled: Boolean!
    methods: AuthMethodsInput!
  }

  input ServiceUsageInput {
    requestsMade: Int
    maxRequests: Int
  }

  input ServicesInput {
    openWeatherApi: ServiceUsageInput
    googleMapsApi: ServiceUsageInput
  }

  input EditUserInput {
    email: String
    role: String
    active: Boolean
    authentication: AuthenticationInput
    services: ServicesInput
  }

  type Mutation {
    editUser(email: String!, input: EditUserInput!): User
    deleteUser(email: String!): User
    resetSingleApiCalls(email: String!, service: String!): User
  }
`;
