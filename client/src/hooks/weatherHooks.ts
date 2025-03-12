import { useEffect } from 'react';

interface UseWeatherMessageParams {
    currentWeatherLoading: boolean;
    currentWeatherError: Error | undefined;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

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
