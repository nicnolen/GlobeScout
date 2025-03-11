import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import ReduxProviderWrapper from '../config/redux/reduxProviderWrapper';
import ApolloProviderWrapper from '../config/graphQL/apolloProviderWrapper';
import NavBar from '../components/common/NavBar';
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
    title: 'CityZen',
    description: 'CityZen helps you discover top attractions and weather insights for cities and countries worldwide.',
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
            <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                <div className="container mx-auto px-4 py-8 min-h-screen">
                    <ReduxProviderWrapper>
                        <ApolloProviderWrapper>
                            <NavBar />
                            {children}
                        </ApolloProviderWrapper>
                    </ReduxProviderWrapper>
                </div>
            </body>
        </html>
    );
}
