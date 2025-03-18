export const GET_TOP_TEN_PLACES = `
    type Location {
        lat: Float
        lng: Float
    }

    type Place {
        name: String
        address: String
        rating: Float
        location: Location
        priceLevel: String
        userRatingCount: Int
        websiteUri: String
        businessStatus: String
        nationalPhoneNumber: String
    }

    type Query {
        getTopTenPlaces(locationSearch: String!): [Place]
    }
`;
