import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { fetchCurrentUser } from '../utils/fetchUserData';
import { catchErrorHandler } from '../utils/errorHandlers';

export const useFetchUserData = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchUserData(): Promise<void> {
            try {
                await fetchCurrentUser(dispatch, router);
            } catch (err: unknown) {
                const customMessage = 'Error fetching user data';
                catchErrorHandler(err, customMessage);

                router.push('/login');
            }
        }

        fetchUserData();
    }, []); // eslint-disable-line  react-hooks/exhaustive-deps
};
