'use client';

import { useState } from 'react';
import axios from 'axios';
import { catchErrorHandler } from '../../utils/errorHandlers';

const TwoFactorSetup = () => {
    const [code, setCode] = useState<string>('');
    const [message, setMessage] = useState<string | null>(null);

    const handleVerifyCode = async () => {
        try {
            const response = await axios.post(
                '/verify-2fa',
                { code: code },
                {
                    withCredentials: true, // Include cookies in the request
                },
            );
            if (response.data.success) {
                alert('2FA setup successful!');
            }
        } catch (err: unknown) {
            const customMessage = 'Error starting server';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

    return (
        <div>
            <h1>Enter Code</h1>
            <div>
                <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter the code from your app"
                />
                <button onClick={handleVerifyCode}>Verify Code</button>
            </div>
            {message && <p style={{ color: 'red' }}>{message}</p>}
        </div>
    );
};

export default TwoFactorSetup;
