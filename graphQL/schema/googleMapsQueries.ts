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
        priceLevel: Int
        userRatingsTotal: Int
        photos: [String]
    }

    type Query {
        getTopTenPlaces(locationSearch: String!): [Place]
    }
`;
