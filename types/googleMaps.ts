// Essential Fields for User Interaction
export interface PlaceProps {
    rank: number;
    name: string;
    address: string;
    rating: number;
    userRatingCount: number;
    priceLevel?: string;
    websiteUri?: string;
    businessStatus: string;
    nationalPhoneNumber?: string;
}

// Google Maps API Place response (simplified)
export interface PlaceResponse {
    displayName: {
        text: string;
        languageCode: string;
    };
    formattedAddress: string;
    rating: number;
    userRatingCount: number;
    priceLevel?: string;
    location: {
        latitude: number;
        longitude: number;
    };
    websiteUri?: string;
    businessStatus: string;
    nationalPhoneNumber?: string;
}

// The response from the Google Maps API Text Search (simplified)
export interface TopTenPlacesResponse {
    results: PlaceResponse[];
    status: string;
}
