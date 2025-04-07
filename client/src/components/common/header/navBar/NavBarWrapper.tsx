'use client';

import React, { JSX } from 'react';
import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

export default function NavBarWrapper(): JSX.Element {
    const pathname = usePathname();

    // Define the pages where NavBar should NOT be displayed
    const isExcludedPage = ['/login', '/forgot', '/2fa', '/reset-password', '/register'].includes(pathname);

    if (isExcludedPage) {
        return null;
    }

    return (
        <div className="sticky top-0 h-16 bg-teal-500 text-white p-4 mb-6 z-10">
            <NavBar />
        </div>
    );
}
