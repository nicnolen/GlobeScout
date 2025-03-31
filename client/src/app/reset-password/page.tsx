'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { catchErrorHandler } from '../../utils/errorHandlers';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.patch('/reset-password', { password }, { withCredentials: true });
            setMessage('Password successfully reset.');
            if (response.status === 200) {
                setTimeout(() => router.push('/'), 1500);
            }
        } catch (err: unknown) {
            const customMessage = 'Error resetting password';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

    const isSuccessMessage = message && message.includes('successfully') ? 'text-green-500' : 'text-red-500';

    return (
        <div className="loginContainer">
            <div className="card max-w-md w-full p-8">
                <h2 className="cardTitle text-center">Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600">
                            New Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                        Reset Password
                    </button>

                    {message && <div className={`${isSuccessMessage} text-sm text-center my-4`}>{message}</div>}
                    <div className="mt-4 text-center">
                        <Link href="/login" className="text-sm text-indigo-600 hover:underline">
                            Back to Login
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
