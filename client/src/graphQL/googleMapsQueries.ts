import { gql } from '@apollo/client';

export const GET_TOP_TEN_PLACES = gql`
    query getTopTenPlaces($locationSearch: String!) {
        getTopTenPlaces(locationSearch: $locationSearch) {
            name
            address
            description
            primaryType
            rating
            location {
                lat
                lng
            }
            priceLevel
            userRatingCount
            websiteUri
            businessStatus
            nationalPhoneNumber
            regularOpeningHours {
                weekdayDescriptions
                openNow
            }
            timeZone {
                id
                version
            }
            parking
        }
    }
`;
