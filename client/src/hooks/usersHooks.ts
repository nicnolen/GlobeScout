import { useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/slices/usersSlice';
import { catchErrorHandler } from '../utils/errorHandlers';

export const useFetchUserData = () => {
    const dispatch = useDispatch();
    const fetchUserData = async () => {
        try {
            // Fetch the current user data from /users/user route
            const userResponse = await axios.get('/users/user', { withCredentials: true });

            if (userResponse.status === 200) {
                const user = userResponse.data.user;
                localStorage.setItem('user', JSON.stringify(user));
                // Dispatch user data to Redux
                dispatch(setUser(user));
            }

            if (userResponse.status !== 200) {
                // Try to load user from localStorage first
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    dispatch(setUser(JSON.parse(storedUser)));
                } else {
                    fetchUserData();
                }
            }
        } catch (err: unknown) {
            const customMessage = 'User login failed';
            catchErrorHandler(err, customMessage);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []); // eslint-disable-line  react-hooks/exhaustive-deps
};

export default useFetchUserData;
