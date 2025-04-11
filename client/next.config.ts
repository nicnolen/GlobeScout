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
    webpack(config, { isServer }) {
        if (!isServer) {
            config.module.rules.push({
                test: /\.map$/,
                use: 'null-loader', // Discards source map files in the browser
            });
        }
        return config;
    },
};

export default nextConfig;
