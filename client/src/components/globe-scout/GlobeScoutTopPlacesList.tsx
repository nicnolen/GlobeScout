import React, { JSX, useState } from 'react';
import Link from 'next/link';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { PlaceProps } from '../../../../types/googleMaps';
import { getPriceLevelColor, getPriceLevelSymbol } from '../../utils/priceLevel';

dayjs.extend(utc);

export default function TopPlacesList({
    rank,
    name,
    address,
    description,
    primaryType,
    rating,
    userRatingCount,
    priceLevel,
    websiteUri,
    businessStatus,
    nationalPhoneNumber,
    regularOpeningHours,
    parking,
}: PlaceProps): JSX.Element {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Get the current day and time
    const now = dayjs().utc();
    const currentDay = now.format('dddd'); // "Monday"

    // Find today's opening hours
    const todayHours = regularOpeningHours?.weekdayDescriptions?.find((day) => day.startsWith(currentDay));

    let statusMessage = 'Closed';
    if (todayHours) {
        // Extract the hours part after the day name (e.g., "12:00 PM – 12:00 AM")
        const hours = todayHours.substring(todayHours.indexOf(':') + 1).trim();

        const [openingTime, closingTime] = hours.split('–').map((time) => dayjs.utc(time.trim(), 'hh:mm A'));

        if (closingTime && closingTime.hour() === 0) {
            // Adjust for midnight closing
            closingTime.add(1, 'day');
        }

        if (now.isBefore(openingTime)) {
            statusMessage = now.add(1, 'hour').isAfter(openingTime) ? 'Opening Soon' : 'Closed';
        } else if (now.isAfter(closingTime)) {
            statusMessage = 'Closed';
        } else if (now.add(1, 'hour').isAfter(closingTime)) {
            statusMessage = 'Closing Soon';
        } else {
            statusMessage = 'Open';
        }
    }
    return (
        <div className="card p-4 mb-4 flex flex-wrap items-start justify-between">
            <div className="flex-shrink-0 text-xl font-bold mr-4">{rank}.</div>

            <div className="flex-1">
                <div className="mb-4">
                    <h3 className="font-semibold text-xl">{name}</h3>
                    <Link href={`https://www.google.com/maps/search/?q=${name}`} target="_blank">
                        <span className="link">{address}</span>
                    </Link>

                    <div className="flex justify-between items-center">
                        <div>
                            <span className="font-medium">{rating} </span>
                            <span className="text-gray-500">({userRatingCount} reviews)</span>
                            {priceLevel !== undefined && (
                                <span className={`font-medium ${getPriceLevelColor(priceLevel)} ml-2`}>
                                    {getPriceLevelSymbol(priceLevel)}
                                </span>
                            )}
                            {regularOpeningHours?.weekdayDescriptions && (
                                <div className="mb-4">
                                    <button
                                        onClick={toggleDropdown}
                                        className="text-blue-600 font-semibold focus:outline-none"
                                    >
                                        {isDropdownOpen ? 'Hide Opening Hours' : 'Show Opening Hours'}
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="mt-2 p-2 border border-gray-300 rounded-lg bg-gray-50 shadow-md">
                                            <h4 className="text-lg font-semibold text-gray-700">Opening Hours</h4>
                                            <ul className="list-disc pl-5 mt-2">
                                                {regularOpeningHours.weekdayDescriptions.map((day, index) => (
                                                    <li key={index} className="text-gray-600">
                                                        <span className="font-medium">{day}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div className="mt-2 text-sm font-semibold">
                                        <span className="text-gray-700">Current Status: </span>
                                        <span
                                            className={`${
                                                statusMessage === 'Open'
                                                    ? 'text-green-600'
                                                    : statusMessage.includes('Soon')
                                                      ? 'text-orange-500'
                                                      : 'text-red-600'
                                            }`}
                                        >
                                            {statusMessage}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {businessStatus && (
                    <div className="mb-1">
                        <span className="text-sm font-medium text-gray-500">Status: </span>
                        <span
                            className={`font-medium ${businessStatus === 'OPERATIONAL' ? 'text-green-600' : 'text-red-600'}`}
                        >
                            {businessStatus}
                        </span>
                    </div>
                )}
                {nationalPhoneNumber && (
                    <div className="mb-1">
                        <span className="text-sm font-medium text-gray-500">Phone: </span>
                        <a href={`tel:${nationalPhoneNumber}`} className="font-medium">
                            {nationalPhoneNumber}
                        </a>
                    </div>
                )}
                {websiteUri && (
                    <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500">Website: </span>
                        <Link href={websiteUri} target="_blank" className="text-blue-600">
                            <span className="link">{websiteUri}</span>
                        </Link>
                    </div>
                )}
            </div>
            <div className="sm:ml-6 sm:mt-0 mt-4 sm:flex-shrink-0 sm:w-1/2">
                <div className="bg-gray-50 p-4 rounded-lg shadow-md">
                    <h4 className="text-lg font-semibold text-gray-700">Description</h4>
                    <p className="text-gray-600 mt-2">{description}</p>
                </div>
            </div>
        </div>
    );
}
