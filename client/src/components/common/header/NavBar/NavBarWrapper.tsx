'use client';

import { usePathname } from 'next/navigation';
import NavBar from './NavBar';

const NavBarWrapper = () => {
    const pathname = usePathname();

    // Define the pages where NavBar should NOT be displayed
    const isExcludedPage = ['/login', '/forgot', '/reset-password'].includes(pathname);

    if (isExcludedPage) {
        return null;
    }

    return (
        <div className="sticky top-0 h-16 bg-teal-500 text-white p-4 mb-6 z-10">
            <NavBar />
        </div>
    );
};

export default NavBarWrapper;
