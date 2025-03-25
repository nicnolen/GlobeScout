'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPassword = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            setToken(token);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            return;
        }

        try {
            await axios.post('/reset-password', { token, password });
            setMessage('Password successfully reset.');
            router.push('/login');
        } catch (err) {
            setMessage(`Error resetting password. ${err}`);
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
        </div>
    );
};

export default ResetPassword;
