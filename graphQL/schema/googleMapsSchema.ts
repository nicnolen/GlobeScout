export const GET_TOP_TEN_PLACES = `
    type Location {
        lat: Float
        lng: Float
    }

    type ParkingOptions {
        freeParkingLot: Boolean
        paidParkingLot: Boolean
        freeStreetParking: Boolean
        paidStreetParking: Boolean
        valetParking: Boolean
        freeGarageParking: Boolean
        paidGarageParking: Boolean
    }

    type RegularOpeningHours {
        weekdayDescriptions: [String]
        openNow: String
    }

    type TimeZone {
        id: String
        version: String
    }

    type Place {
        name: String
        address: String
        description: String
        primaryType: String
        rating: Float
        location: Location
        priceLevel: String
        userRatingCount: Int
        websiteUri: String
        businessStatus: String
        nationalPhoneNumber: String
        parking: String
        regularOpeningHours: RegularOpeningHours
        timeZone: TimeZone
    }

    type Query {
        getTopTenPlaces(locationSearch: String!): [Place]
    }
`;
