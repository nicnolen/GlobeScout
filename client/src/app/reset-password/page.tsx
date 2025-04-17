'use client';

import { JSX, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '../../utils/apiHandler';
import { catchErrorHandler } from '../../utils/errorHandlers';

export default function ResetPassword(): JSX.Element {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.patch('/reset-password', { password }, { withCredentials: true });
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
                            id="newPassword"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input mt-1 w-full"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full button primaryButton py-2 px-4">
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
}
