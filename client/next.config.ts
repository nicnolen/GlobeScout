import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    // hides the next error messages in the bottom left of the home screen
    devIndicators: false,
    images: {
        remotePatterns: [
            {
                hostname: 'openweathermap.org',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/:path*',
                destination: `${process.env.NEXT_PUBLIC_URL_ENDPOINT}`,
            },
        ];
    },
};

export default nextConfig;
