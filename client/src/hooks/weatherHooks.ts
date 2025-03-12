import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Weather } from '../../../types/weather';
import { setCurrentWeatherData } from '../redux/slices/weatherSlice';

interface UseCurrentWeatherDataParams {
    currentWeatherLoading: boolean;
    currentWeatherError: Error | undefined;
    currentWeatherData: Weather | undefined;
    setMessage: React.Dispatch<React.SetStateAction<string>>;
}

export const useCurrentWeatherData = ({
    currentWeatherLoading,
    currentWeatherError,
    currentWeatherData,
    setMessage,
}: UseCurrentWeatherDataParams): void => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentWeatherLoading) {
            setMessage('Loading...');
        } else if (currentWeatherError) {
            setMessage(`An error occurred with Apollo: ${currentWeatherError.message}`);
        } else {
            dispatch(setCurrentWeatherData(currentWeatherData));
            setMessage('');
        }
    }, [currentWeatherLoading, currentWeatherError]); // eslint-disable-line  react-hooks/exhaustive-deps
};
