'use client';

import { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { fetchCurrentUser } from '../../utils/fetchUserData';
import { catchErrorHandler } from '../../utils/errorHandlers';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();
    const dispatch = useDispatch();

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setMessage('');
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        setMessage('');
    };

    const fetchUserLoginData = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('/login', { email, password }, { withCredentials: true });

            if (response.status === 200) {
                setMessage('Login successful');

                // Fetch the user data from /users/user route
                await fetchCurrentUser(dispatch);
                router.push('/');
            }
        } catch (err: unknown) {
            const customMessage = 'User login failed';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

    return (
        <div className="loginContainer">
            <div className="card max-w-md w-full p-8">
                <h2 className="cardTitle text-center">Login</h2>
                <form onSubmit={fetchUserLoginData}>
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
                    <div className="mt-4 text-center">
                        <Link href="/forgot" className="text-sm text-indigo-600 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
