import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // hides the next error messages in the bottom left of the home screen
    devIndicators: false,
    images: {
        domains: ['openweathermap.org'],
    },
};

export default nextConfig;
