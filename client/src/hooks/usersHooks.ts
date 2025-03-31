import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../utils/fetchUserData';
import { catchErrorHandler } from '../utils/errorHandlers';

export const useFetchUserData = () => {
    // Note: due to React strict mode, you will see this useEffect ran twice ONLY in development
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchUserData(): Promise<void> {
            try {
                await fetchCurrentUser(dispatch);
            } catch (err: unknown) {
                const customMessage = 'Error fetching user data';
                catchErrorHandler(err, customMessage);
            }
        }

        fetchUserData();
    }, []); // eslint-disable-line  react-hooks/exhaustive-deps
};
