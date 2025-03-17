import { gql } from '@apollo/client';

export const GET_TOP_TEN_PLACES = gql`
    query getTopTenPlaces($locationSearch: String!) {
        getTopTenPlaces(locationSearch: $locationSearch) {
            name
            address
            rating
            location {
                lat
                lng
            }
            priceLevel
            userRatingsTotal
        }
    }
`;
