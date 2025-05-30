import React, { JSX, useState } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { selectCurrentWeatherData } from '../../../../redux/selectors/weatherSelectors';
import { selectUser } from '../../../../redux/selectors/usersSelectors';
import { useOutsideClick, useAutoLogout } from '../../../../hooks/eventHooks';
import { useFetchUserData } from '../../../../hooks/usersHooks';
import Tooltip from '../../Tooltip';
import SettingsDropdown from '../settings/SettingsDropdown';

export default function NavBar(): JSX.Element {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const pathname = usePathname();
    const currentWeatherData = useSelector(selectCurrentWeatherData);
    const user = useSelector(selectUser);

    useFetchUserData();
    useAutoLogout();

    function isActive(path: string): string {
        return pathname === path ? 'text-yellow-400' : 'hover:text-yellow-400;';
    }

    function toggleDropdown(): void {
        setIsDropdownOpen(!isDropdownOpen);
    }

    const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false));

    const isDisabled = !currentWeatherData;
    const disabledForecastTooltipMessage = 'Must search a city or country first';

    return (
        <nav>
            <ul className="flex space-x-8 justify-between items-center w-full">
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
                    <Tooltip message={disabledForecastTooltipMessage} showTooltip={isDisabled}>
                        <Link
                            href="/weather-forecast"
                            className={`${!currentWeatherData ? 'disabledLink' : ''}`}
                            onClick={(e) => isDisabled && e.preventDefault()}
                        >
                            <span className={`${isActive('/weather-forecast')}`}>Weather Forecast</span>
                        </Link>
                    </Tooltip>
                </li>
                {user && user.role === 'admin' && (
                    <li>
                        <Link href="/admin">
                            <span className={`${isActive('/admin')}`}>Admin</span>
                        </Link>
                    </li>
                )}
                <li className="ml-auto relative" ref={dropdownRef}>
                    <button className="button" onClick={toggleDropdown}>
                        <i className="fas fa-gear text-small mr-1.25" />
                        <span className="hidden sm:inline">Settings</span>
                    </button>
                    {isDropdownOpen && (
                        <div className="card absolute right-0 mt-2">
                            <SettingsDropdown />
                        </div>
                    )}
                </li>
            </ul>
        </nav>
    );
}
