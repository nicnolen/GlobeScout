'use client'; // Marking this file as a client component

import React, { JSX } from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { selectCurrentWeatherData } from '../../redux/selectors/weatherSelectors';
import Tooltip from './Tooltip';

export default function NavBar(): JSX.Element {
    const pathname = usePathname();
    const currentWeatherData = useSelector(selectCurrentWeatherData);

    function isActive(path: string): string {
        return pathname === path ? 'text-yellow-400' : 'hover:text-yellow-400;';
    }

    const isDisabled = !currentWeatherData;
    const disabledForecastTooltipMessage = 'Must search a city or country first';

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
