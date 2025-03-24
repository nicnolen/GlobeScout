import axios from 'axios';
import { useRouter } from 'next/navigation';
import { UserData } from '../../../types/users';
import { AppDispatch } from '../redux/store';
import { setUser } from '../redux/slices/usersSlice';
import { catchErrorHandler } from '../utils/errorHandlers';

// Reusable function to handle login and fetching user data
export async function fetchCurrentUser(dispatch: AppDispatch, router: ReturnType<typeof useRouter>): Promise<void> {
    try {
        const { data, status } = await axios.get<{ user: UserData }>('/users/user', { withCredentials: true });

        if (!data?.user || !data.user.active) {
            const errorMessage = !data?.user ? 'User data not found' : 'User account is inactive';
            console.error(errorMessage, 'redirecting to the login page');

            router.push('/login');
            return;
        }

        if (status === 200 && data?.user) {
            dispatch(setUser(data.user));
            return;
        }
    } catch (err: unknown) {
        const customMessage = 'Error fetching user data';
        catchErrorHandler(err, customMessage);

        router.push('/login');
        throw err;
    }
}
