'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { catchErrorHandler } from '../../utils/errorHandlers';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState<string>('');
    const router = useRouter();

    // Fetch the current user's data
    const fetchUserData = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const response = await axios.post('/login', { email, password }, { withCredentials: true }); // Send request to /user route

            if (response.status === 200) {
                setTimeout(() => {
                    setMessage('Login successful');
                }, 5000);

                router.push('/');
            }
        } catch (err: unknown) {
            const customMessage = 'User login failed';
            catchErrorHandler(err, customMessage, setMessage);

            router.push('/login');
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <form onSubmit={fetchUserData}>
                <div>
                    <label>Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                {message && <div style={{ color: 'red' }}>{message}</div>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
