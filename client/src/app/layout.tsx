import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ApolloProviderWrapper from '../config/graphQL/ApolloProviderWrapper';
import ReduxProviderWrapper from '../config/redux/reduxProviderWrapper';
import NavBarWrapper from '../components/common/header/NavBar/NavBarWrapper';
import Footer from '../components/common/Footer';
import './globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'GlobeScout',
    description:
        'GlobeScout helps you discover top attractions and weather insights for cities and countries worldwide.',
    icons: {
        icon: [
            {
                url: '/favicon.ico',
                href: '/favicon.ico',
            },
        ],
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                {/* Adding Font Awesome CDN globally */}
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"
                />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ApolloProviderWrapper>
                    <ReduxProviderWrapper>
                        <div className="flex flex-col min-h-screen w-full">
                            <NavBarWrapper />
                            <div className="flex h-auto flex-grow  mx-4">{children}</div>
                            <div className="h-20 flex items-center bottom-0 bg-gray-800 text-white p-4 mt-6">
                                <Footer />
                            </div>
                        </div>
                    </ReduxProviderWrapper>
                </ApolloProviderWrapper>
            </body>
        </html>
    );
}
