'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { catchErrorHandler } from '../../utils/errorHandlers';

const ResetPassword = () => {
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await axios.post('/reset-password', { password }, { withCredentials: true });
            setMessage('Password successfully reset.');
            router.push('/login');
        } catch (err: unknown) {
            const customMessage = 'Error resetting password';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

    return (
        <div>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>New Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
            <button onClick={() => router.push('/login')} style={{ marginTop: '10px' }}>
                Back to Login
            </button>
        </div>
    );
};

export default ResetPassword;
