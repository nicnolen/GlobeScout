import { gql } from '@apollo/client';

export const GET_CURRENT_USER = gql`
    query getCurrentUser {
        getCurrentUser {
            email
            role
            lastLogin
            active
            authentication {
                enabled
                methods {
                    email
                    authenticator
                }
            }
            services {
                openWeatherApi {
                    requestsMade
                    maxRequests
                }
                googleMapsApi {
                    requestsMade
                    maxRequests
                }
            }
        }
    }
`;

export const GET_ALL_USERS = gql`
    query getAllUsers {
        getAllUsers {
            email
            role
            lastLogin
            active
            authentication {
                enabled
                methods {
                    email
                    authenticator
                }
            }
            services {
                openWeatherApi {
                    requestsMade
                    maxRequests
                }
                googleMapsApi {
                    requestsMade
                    maxRequests
                }
            }
        }
    }
`;
