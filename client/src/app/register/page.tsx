'use client';

import React, { JSX, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { catchErrorHandler } from '../../utils/errorHandlers';

export default function RegisterPage(): JSX.Element {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
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

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post(
                '/register',
                { email, password },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                },
            );

            setMessage(response.data.message);
            if (response.status === 201) {
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err: unknown) {
            const customMessage = 'Failed to register user';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

    const isSuccessMessage = message && message.includes('successful') ? 'text-green-500' : 'text-red-500';

    return (
        <div className="loginContainer">
            <div className="card max-w-md w-full p-8">
                <h2 className="cardTitle text-center">Register New Account</h2>
                <form onSubmit={handleRegisterSubmit}>
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
                        Register
                    </button>
                    <div className="mt-4 text-center">
                        {message && <div className={`${isSuccessMessage} text-sm text-center my-4`}>{message}</div>}
                        <Link href="/login" className="link text-sm">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
