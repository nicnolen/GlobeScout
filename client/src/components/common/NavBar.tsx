'use client'; // Marking this file as a client component

import React, { JSX } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavBar(): JSX.Element {
    const pathname = usePathname();

    function isActive(path: string): string {
        return pathname === path ? 'text-yellow-400' : 'hover:text-yellow-400;';
    }

    return (
        <nav className="bg-teal-500 text-white p-4 mb-4 shadow-md">
            <div className="container mx-auto">
                <ul className="flex space-x-8 justify-center">
                    <li>
                        <Link href="/">
                            <span className={`${isActive('/')}`}>Home</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/globe-scout">
                            <span className={`${isActive('/globe-scout')}`}>Globe Scout</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/weather-forecast">
                            <span className={`${isActive('/weather-forecast')}`}>Weather Forecast</span>
                        </Link>
                    </li>
                    <li>
                        <Link href="/users">
                            <span className={`${isActive('/users')}`}>Users</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
