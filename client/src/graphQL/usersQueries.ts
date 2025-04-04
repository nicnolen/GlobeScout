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

export const EDIT_USER = gql`
    mutation EditUser($email: String!, $input: EditUserInput!) {
        editUser(email: $email, input: $input) {
            email
            role
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

export const DELETE_USER = gql`
    mutation DeleteUser($email: String!) {
        deleteUser(email: $email) {
            email
            role
            active
            authentication {
                enabled
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

export const RESET_SINGLE_API_CALLS = gql`
    mutation ResetSingleAPiCalls($email: String!, $service: String!) {
        resetSingleApiCalls(email: $email, service: $service) {
            email
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
