// GraphQL query structure
export interface Place {
    name: string;
    address: string;
    rating: number;
    location: {
        lat: number;
        lng: number;
    };
    priceLevel: number;
    userRatingsTotal: number;
    photos: string[];
}

// Google Maps API Responses
interface PhotoResponse {
    height: number;
    width: number;
    html_attributions: string[];
    photo_reference: string;
}

export interface PlaceResponse {
    business_status: string;
    formatted_address: string;
    geometry: {
        location: {
            lat: number;
            lng: number;
        };
        viewport: {
            northeast: {
                lat: number;
                lng: number;
            };
            southwest: {
                lat: number;
                lng: number;
            };
        };
    };
    icon: string;
    icon_background_color: string;
    icon_mask_base_uri: string;
    name: string;
    opening_hours: {
        open_now: boolean;
    };
    photos: PhotoResponse[];
    place_id: string;
    plus_code: {
        compound_code: string;
        global_code: string;
    };
    price_level: number;
    rating: number;
    reference: string;
    types: string[];
    user_ratings_total: number;
}

// The response from the Google Maps API Text Search
export interface TopTenPlacesResponse {
    html_attributions: string[];
    next_page_token?: string;
    results: PlaceResponse[];
    status: string;
}
