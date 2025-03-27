'use client';

import { usePathname } from 'next/navigation';
import NavBar from '../NavBar/NavBar';

const NavBarWrapper = () => {
    const pathname = usePathname();

    // Define the pages where NavBar should NOT be displayed
    const isExcludedPage = ['/login', '/forgot', '/reset-password'].includes(pathname);

    if (isExcludedPage) {
        return null;
    }

    return (
        <div className="header">
            <NavBar />;
        </div>
    );
};

export default NavBarWrapper;
