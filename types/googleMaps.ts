// Essential Fields for User Interaction
export interface PlaceProps {
    rank: number;
    name: string;
    address: string;
    rating: number;
    userRatingCount: number;
    priceLevel?: string;
    photos?: Photo[];
    websiteUri?: string;
    businessStatus: string;
    nationalPhoneNumber?: string;
}

// Google Maps API Photo response
interface Photo {
    height: number;
    width: number;
    attributions: string[];
    reference: string;
}

// Google Maps API Place response (simplified)
export interface PlaceResponse {
    displayName: {
        text: string;
        languageCode: string;
    };
    formattedAddress: string;
    rating: number;
    userRatingsTotal: number;
    priceLevel?: string;
    location: {
        latitude: number;
        longitude: number;
    };
    photos?: Photo[];
    websiteUri?: string;
    businessStatus: string;
    nationalPhoneNumber?: string;
}

// The response from the Google Maps API Text Search (simplified)
export interface TopTenPlacesResponse {
    results: PlaceResponse[];
    status: string;
}
