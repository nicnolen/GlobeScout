'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { catchErrorHandler } from '../../utils/errorHandlers';

export default function TwoFactorSetup() {
    const [code, setCode] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
    const [emailSent, setEmailSent] = useState<boolean>(false);
    const router = useRouter();

    const handleVerifyCode = async () => {
        try {
            const response = await axios.post(
                '/validate-2fa',
                { code: code },
                {
                    withCredentials: true,
                },
            );

            setMessage(response.data.message);

            if (response.status === 200) {
                setTimeout(() => router.push('/'), 1500);
            }
        } catch (err: unknown) {
            const customMessage = 'Error starting server';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

    const handleEmailCode = async () => {
        try {
            const response = await axios.post('/email-2fa-code', {}, { withCredentials: true });

            setMessage(response.data.message);
            setEmailSent(true);
        } catch (err: unknown) {
            const customMessage = 'Error sending backup code';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

    const isSuccessfulAuth = message && message.includes('authenticated') ? 'text-green-500' : 'text-red-500';

    return (
        <div className="loginContainer">
            <div className="card max-w-md w-full p-8">
                <h1 className="cardTitle text-center">Enter Authentication Code</h1>
                <p className="text-sm text-gray-600 mb-6 text-center">Enter the code from your authenticator app.</p>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Enter code"
                        className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleVerifyCode}
                        className="px-4 py-2 bg-blue-600 text-white text-nowrap rounded-lg hover:bg-blue-700 transition"
                    >
                        <i className="fas fa-check-circle mr-1" /> Verify
                    </button>
                </div>
                {message && <p className={`${isSuccessfulAuth} mt-4 text-sm text-center`}>{message}</p>}
                <button
                    onClick={handleEmailCode}
                    disabled={emailSent}
                    className="mt-4 text-blue-600 underline text-sm disabled:opacity-50"
                >
                    {emailSent ? 'Backup code sent!' : 'Lost access to your app? Get a backup code via email'}
                </button>
            </div>
        </div>
    );
}
