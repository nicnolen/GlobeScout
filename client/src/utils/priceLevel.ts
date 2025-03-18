export function getPriceLevelColor(priceLevel: string): string {
    switch (priceLevel) {
        case 'PRICE_LEVEL_FREE':
            return 'text-blue-500'; // Adjust color for free services
        case 'PRICE_LEVEL_INEXPENSIVE':
            return 'text-green-600';
        case 'PRICE_LEVEL_MODERATE':
            return 'text-yellow-500';
        case 'PRICE_LEVEL_EXPENSIVE':
            return 'text-red-600';
        case 'PRICE_LEVEL_VERY_EXPENSIVE':
            return 'text-purple-700'; // Adjust color for very expensive services
        case 'PRICE_LEVEL_UNSPECIFIED':
        default:
            return 'text-gray-500'; // Default color for unspecified price levels
    }
}

export function getPriceLevelSymbol(priceLevel: string): string {
    switch (priceLevel) {
        case 'PRICE_LEVEL_FREE':
            return 'Free';
        case 'PRICE_LEVEL_INEXPENSIVE':
            return '$';
        case 'PRICE_LEVEL_MODERATE':
            return '$$';
        case 'PRICE_LEVEL_EXPENSIVE':
            return '$$$';
        case 'PRICE_LEVEL_VERY_EXPENSIVE':
            return '$$$$';
        case 'PRICE_LEVEL_UNSPECIFIED':
        default:
            return 'N/A';
    }
}
