// Essential Fields for User Interaction
export interface PlaceProps {
    rank: number;
    name: string;
    address: string;
    description: string;
    primaryType: string;
    rating: number;
    userRatingCount: number;
    priceLevel?: string;
    websiteUri?: string;
    businessStatus: string;
    nationalPhoneNumber?: string;
    parking?: string;
    regularOpeningHours?: {
        weekdayDescriptions: string[];
        openNow: string;
    };
    timeZone: {
        id: string;
        version?: string;
    };
}

interface GenerativeSummary {
    overview: {
        text: string;
        languageCode: string;
    };
    description: {
        text: string;
    };
}

// Define the Date object for SpecialDay
interface DateObject {
    year: number;
    month: number; // 1-based month (January = 1, December = 12)
    day: number;
}

// Define the Point object for time representation (open/close)
interface Point {
    date: DateObject;
    truncated: boolean; // Whether the time is truncated (e.g., missing specific time)
    day: number; // 0: Sunday, 1: Monday, ..., 6: Saturday
    hour: number; // Hour in 24-hour format (0-23)
    minute: number;
}

// Enum for secondary hours types
enum SecondaryHoursType {
    SECONDARY_HOURS_TYPE_UNSPECIFIED = 'SECONDARY_HOURS_TYPE_UNSPECIFIED',
    DRIVE_THROUGH = 'DRIVE_THROUGH',
    HAPPY_HOUR = 'HAPPY_HOUR',
    DELIVERY = 'DELIVERY',
    TAKEOUT = 'TAKEOUT',
    KITCHEN = 'KITCHEN',
    BREAKFAST = 'BREAKFAST',
    LUNCH = 'LUNCH',
    DINNER = 'DINNER',
    BRUNCH = 'BRUNCH',
    PICKUP = 'PICKUP',
    ACCESS = 'ACCESS',
    SENIOR_HOURS = 'SENIOR_HOURS',
    ONLINE_SERVICE_HOURS = 'ONLINE_SERVICE_HOURS',
}

// Define the Period object (open and close times for each period)
interface Period {
    open: Point;
    close: Point;
}

// Define the SpecialDay object for special days with their specific date and open/close times
interface SpecialDay {
    date: DateObject;
    open: boolean;
    openTime?: Point;
    closeTime?: Point;
}

// Define the RegularOpeningHours object
interface RegularOpeningHours {
    periods: Period[]; // Array of periods for regular opening and closing times
    weekdayDescriptions: string[]; // Descriptions for each weekday (e.g., "Monday: Open 9 AM - 5 PM")
    secondaryHoursType: SecondaryHoursType;
    specialDays: SpecialDay[]; // Array of special days with specific open/close times
    nextOpenTime: string;
    nextCloseTime: string;
    openNow: boolean;
}

// Google Maps API Place response (simplified)
export interface PlaceResponse {
    displayName: {
        text: string;
        languageCode: string;
    };
    formattedAddress: string;
    generativeSummary?: GenerativeSummary;
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
    primaryTypeDisplayName: {
        text: string;
        languageCode: string;
    };
    regularOpeningHours?: RegularOpeningHours;
    timeZone: {
        id: string;
        version?: string;
    };
    parkingOptions?: {
        freeParkingLot: boolean;
        paidParkingLot: boolean;
        freeStreetParking: boolean;
        paidStreetParking: boolean;
        valetParking: boolean;
        freeGarageParking: boolean;
        paidGarageParking: boolean;
    };
}

// The response from the Google Maps API Text Search (simplified)
export interface TopTenPlacesResponse {
    results: PlaceResponse[];
    status: string;
}
