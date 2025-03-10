import { useEffect } from 'react';
import { UseWeatherMessageParams } from '../types/weather';

export const useCurrentWeatherMessage = ({
    currentWeatherLoading,
    currentWeatherError,
    setMessage,
}: UseWeatherMessageParams): void => {
    useEffect(() => {
        if (currentWeatherLoading) {
            setMessage('Loading...');
        } else if (currentWeatherError) {
            setMessage(`An error occurred with Apollo: ${currentWeatherError.message}`);
        } else {
            setMessage('');
        }
    }, [currentWeatherLoading, currentWeatherError]); // eslint-disable-line  react-hooks/exhaustive-deps
};
