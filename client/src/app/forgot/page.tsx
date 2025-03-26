'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { catchErrorHandler } from '../../utils/errorHandlers';

const ResetPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

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

    return (
        <div className="min-h-screen bg-gray-100 flex justify-center items-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-700 mb-8">Reset Password</h2>
                <form onSubmit={handleResetPassword}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                            Enter your email:
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
                    {message && <div className="text-green-500 text-sm mb-4">{message}</div>}
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        Send Reset Link
                    </button>
                    <button onClick={() => router.push('/login')} style={{ marginTop: '10px' }}>
                        Back to Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
