'use client';

import React, { JSX, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { catchErrorHandler } from '../../utils/errorHandlers';

export default function LoginPage(): JSX.Element {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

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

            setMessage(response.data.message);

            if (response.status === 200) {
                const is2FA = response.data.message.includes('2FA');
                if (is2FA) {
                    router.push('/2fa');
                    return;
                }

                router.push('/');
            }
        } catch (err: unknown) {
            const customMessage = 'User login failed';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

    const isSuccessMessage = message && message.includes('successful') ? 'text-green-500' : 'text-red-500';

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
                            className="input mt-1 w-full"
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
                            className="input mt-1 w-full"
                        />
                    </div>
                    <button type="submit" className="button primaryButton w-full py-2 px-4">
                        Login
                    </button>
                    {message && <div className={`${isSuccessMessage} text-sm text-center my-4`}>{message}</div>}
                    <div className="mt-4 text-center">
                        <Link href="/forgot" className="text-sm text-indigo-600 hover:underline">
                            Forgot Password?
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
