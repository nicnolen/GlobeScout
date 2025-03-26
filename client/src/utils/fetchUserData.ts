import axios from 'axios';
import { UserData } from '../../../types/users';
import { AppDispatch } from '../redux/store';
import { setUser } from '../redux/slices/usersSlice';
import { catchErrorHandler } from '../utils/errorHandlers';

export async function verifyUser(): Promise<boolean> {
    try {
        const response = await axios.get('/verify', { withCredentials: true });
        return response.status === 200;
    } catch (err: unknown) {
        const customMessage = 'Error verifying user';
        catchErrorHandler(err, customMessage);
        return false;
    }
}

// Reusable function to handle login and fetching user data
export async function fetchCurrentUser(dispatch: AppDispatch): Promise<void> {
    try {
        const isVerified = await verifyUser();
        if (!isVerified) {
            return;
        }

        const { data, status } = await axios.get<{ user: UserData }>('/users/user', { withCredentials: true });

        if (status === 200 && data?.user) {
            dispatch(setUser(data.user));
            return;
        }
    } catch (err: unknown) {
        const customMessage = 'Error fetching user data';
        catchErrorHandler(err, customMessage);

        throw err;
    }
}
