'use client';

import React, { JSX, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { catchErrorHandler } from '../../utils/errorHandlers';

export default function TwoFactorSetup(): JSX.Element {
    const [code, setCode] = useState<string>('');
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    async function handleValidateCode(): Promise<void> {
        try {
            setLoading(true);
            const response = await axios.post<{ message: string }>(
                '/validate-2fa',
                { code },
                {
                    withCredentials: true,
                },
            );

            setMessage(response.data.message);

            if (response.status === 200) {
                setTimeout(() => router.push('/'), 1500);
                setLoading(false);
            }
        } catch (err: unknown) {
            const customMessage = 'Error starting server';
            catchErrorHandler(err, customMessage, setMessage);
            setLoading(false);
        }
    }

    async function handleEmailCode(): Promise<void> {
        try {
            setLoading(true);
            setMessage('');
            const response = await axios.post<{ message: string }>('/email-2fa-code', {}, { withCredentials: true });

            setMessage(response.data.message);
            setLoading(false);
        } catch (err: unknown) {
            const customMessage = 'Error sending backup code';
            catchErrorHandler(err, customMessage, setMessage);
            setLoading(false);
        }
    }

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
                        className="input"
                    />
                    <button
                        onClick={handleValidateCode}
                        disabled={loading}
                        className="button primaryButton py-2 px-4 text-nowrap"
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin me-2 text-primary" />
                                <span>Verifying Code</span>
                            </>
                        ) : (
                            <>
                                <i className="fas fa-check-circle me-1" />
                                <span>Verify</span>
                            </>
                        )}
                    </button>
                </div>
                {message && <p className={`${isSuccessfulAuth} mt-4 text-sm text-center`}>{message}</p>}
                <button
                    onClick={handleEmailCode}
                    disabled={loading}
                    className="button mt-4 w-full text-blue-600 text-sm hover:underline disabled:no-underline disabled:pointer-events-none"
                >
                    {loading ? (
                        <>
                            <i className="fa fa-spinner fa-spin mr-2 text-blue-600" />
                            <span>Sending Email</span>
                        </>
                    ) : (
                        'Lost access to your app? Get a backup code via email'
                    )}
                </button>
            </div>
        </div>
    );
}
