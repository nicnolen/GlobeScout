import { GraphQLError } from 'graphql';

// Helper function for validation
export function validateWeatherProps(props: {
    locationSearch: string;
    units: string;
    openWeatherApiKey: string;
    openWeatherUrl: string;
}) {
    const { locationSearch, units, openWeatherApiKey, openWeatherUrl } = props;

    if (!openWeatherApiKey) {
        throw new GraphQLError('OpenWeatherMap Error: API Key is missing.');
    }
    if (!openWeatherUrl) {
        throw new GraphQLError('OpenWeatherMap Error: Base URL is missing.');
    }
    if (!locationSearch) {
        throw new GraphQLError('Location is required, please provide a valid city or country.');
    }
    if (!units) {
        throw new GraphQLError('Units are required. Please select either "Metric" or "Imperial" units.');
    }
}
