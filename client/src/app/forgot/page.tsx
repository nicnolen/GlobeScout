'use client';

import React, { JSX, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { catchErrorHandler } from '../../utils/errorHandlers';

export default function ResetPasswordPage(): JSX.Element {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string>('');

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        setMessage('');
    };

    const handleResetPassword = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('/forgot', { email });

            if (response.status === 200) {
                setMessage('Password reset link sent. Check your email.');
            }
        } catch (err: unknown) {
            const customMessage = 'Failed to send password reset email';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

    const isEmailSent = message && message.includes('sent') ? 'text-green-500' : 'text-red-500';

    return (
        <div className="loginContainer">
            <div className="card max-w-md w-full p-8">
                <h2 className="cardTitle text-center">Forgot Password</h2>
                <form onSubmit={handleResetPassword}>
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
                            className="input mt-1"
                        />
                    </div>

                    <button type="submit" className="w-full button primaryButton py-2 px-4">
                        Send Reset Link
                    </button>
                    {message && <div className={`${isEmailSent} text-sm text-center my-4`}>{message}</div>}
                    <div className="mt-4 text-center">
                        <Link href="/login" className="text-sm text-indigo-600 hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
