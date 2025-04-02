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
    requestsMade: Int!
    maxRequests: Int!
  }

  type Services {
    openWeatherApi: ServiceUsage!
    googleMapsApi: ServiceUsage!
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
