'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { catchErrorHandler } from '../../utils/errorHandlers';

const TwoFactorSetup = () => {
    const [code, setCode] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);
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

            if (response.status === 200) {
                setMessage('2FA setup successful!');
                setTimeout(() => router.push('/'), 1500);
            }
        } catch (err: unknown) {
            const customMessage = 'Error starting server';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

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
                {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
            </div>
        </div>
    );
};

export default TwoFactorSetup;
