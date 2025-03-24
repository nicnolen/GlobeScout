'use client';

import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { setUser } from '../../redux/slices/usersSlice';
import { catchErrorHandler } from '../../utils/errorHandlers';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();
    const dispatch = useDispatch();

    // Handle email input change
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setMessage(''); // Clear message when the user types
    };

    // Handle password input change
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setMessage(''); // Clear message when the user types
    };

    // Fetch the current user's data
    const fetchUserData = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('/login', { email, password }, { withCredentials: true }); // Send request to /user route

            if (response.status === 200) {
                setMessage('Login successful');
                // Fetch the user data from /users/user route
                const userResponse = await axios.get('/users/user', { withCredentials: true });

                const user = userResponse.data.user;

                // Dispatch user to Redux
                dispatch(setUser(user));

                router.push('/');
            } else {
                setMessage(response.data.message);
            }
        } catch (err: unknown) {
            const customMessage = 'User login failed';
            catchErrorHandler(err, customMessage, setMessage);

            router.push('/login');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">Login</h2>
                <form onSubmit={fetchUserData}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                            Email:
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={handleEmailChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                            Password:
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    {message && <div className="text-red-500 text-sm mb-4">{message}</div>}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
