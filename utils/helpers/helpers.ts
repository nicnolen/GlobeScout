// Helper function to format locationSearch
export function formatLocation(locationSearch: string): string {
    const sanitizedLocation = locationSearch.trim().toLowerCase();
    // Capitalize first letter of each word for display
    const displayLocation = sanitizedLocation.replace(/\b\w/g, (char) => char.toUpperCase());

    return displayLocation;
}
