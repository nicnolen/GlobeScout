import axios from 'axios';

const api = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_URL_ENDPOINT}/api`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
