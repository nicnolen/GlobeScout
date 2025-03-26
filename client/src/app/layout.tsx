import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ApolloProviderWrapper from '../config/graphQL/ApolloProviderWrapper';
import ReduxProviderWrapper from '../config/redux/reduxProviderWrapper';
import NavBar from '../components/common/NavBar';
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
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
                />
            </head>
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <ApolloProviderWrapper>
                    <ReduxProviderWrapper>
                        <NavBar />
                        <div className="m-4 ">{children}</div>
                    </ReduxProviderWrapper>
                </ApolloProviderWrapper>
                <Footer />
            </body>
        </html>
    );
}
