import { gql } from '@apollo/client';

export const GET_GREETING = gql`
    query GetGreeting {
        getGreeting
    }
`;
