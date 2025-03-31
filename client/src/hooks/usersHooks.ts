import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCurrentUser } from '../utils/fetchUserData';
import { catchErrorHandler } from '../utils/errorHandlers';

export const useFetchUserData = () => {
    const dispatch = useDispatch();
    const hasFetched = useRef(false); // make sure react strict mode doesn't run this twice

    useEffect(() => {
        if (hasFetched.current) {
            return;
        }
        async function fetchUserData(): Promise<void> {
            try {
                await fetchCurrentUser(dispatch);
            } catch (err: unknown) {
                const customMessage = 'Error fetching user data';
                catchErrorHandler(err, customMessage);
            }
        }

        fetchUserData();
        hasFetched.current = true;
    }, []); // eslint-disable-line  react-hooks/exhaustive-deps
};
