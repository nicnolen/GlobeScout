import React, { JSX, useState } from 'react';
import Link from 'next/link';
import { PlaceProps } from '../../../../types/googleMaps';
import { getPriceLevelColor, getPriceLevelSymbol } from '../../utils/priceLevel';

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
    timeZone,
}: PlaceProps): JSX.Element {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const { weekdayDescriptions, openNow } = regularOpeningHours || {}; // default to empty object when regularOpeningHours is undefined

    return (
        <div className="card p-4 mb-4 flex flex-col sm:flex-row">
            <div className="flex-shrink-0 text-xl font-bold mr-4 mb-4 sm:mb-0">{rank}.</div>

            <div className="flex-1 sm:max-w-[calc(100%-300px)]">
                <div className="mb-4">
                    <h3 className="font-semibold text-xl">
                        {name}{' '}
                        {primaryType && <span className="text-sm font-medium text-gray-500">({primaryType}) </span>}
                    </h3>
                    <div className="mb-2 flex items-center">
                        <Link href={`https://www.google.com/maps/search/?q=${name}`} target="_blank">
                            <span className="text-blue-600 link">{address}</span>
                        </Link>
                    </div>

                    <div className="flex justify-between items-center">
                        <div>
                            <span className="font-medium">
                                <i className="fas fa-star text-yellow-500 mr-1 text-sm" />
                                {rating}{' '}
                            </span>
                            <span className="text-gray-500">({userRatingCount} reviews)</span>
                            {priceLevel !== undefined && (
                                <span className={`font-medium ${getPriceLevelColor(priceLevel)} ml-2`}>
                                    {getPriceLevelSymbol(priceLevel)}
                                </span>
                            )}

                            {weekdayDescriptions && openNow && (
                                <div className="flex items-center mt-2">
                                    <span
                                        className={`${
                                            openNow === 'Open' || openNow === 'Open 24 hours'
                                                ? 'text-green-600'
                                                : openNow.includes('Soon')
                                                  ? 'text-orange-500'
                                                  : 'text-red-600'
                                        }`}
                                    >
                                        {openNow}
                                    </span>
                                    <button onClick={toggleDropdown} className="button primaryButton ml-2 text-sm">
                                        {isDropdownOpen ? 'Hide Hours' : 'Show Hours'}
                                    </button>
                                </div>
                            )}
                            {isDropdownOpen && weekdayDescriptions && (
                                <div className="mt-2 p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-md">
                                    <h4 className="text-lg font-semibold text-gray-700">Opening Hours</h4>
                                    <ul className="mt-2">
                                        {weekdayDescriptions.map((day, index) => (
                                            <li key={index} className="text-gray-600 list-none">
                                                <span className="font-medium">{day}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {businessStatus && (
                    <div className="mb-1">
                        <span className="text-sm font-medium text-gray-500">Status: </span>
                        <span
                            className={`font-medium ${businessStatus === 'Operational' ? 'text-green-600' : 'text-red-600'}`}
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
                        <Link href={websiteUri} target="_blank" className="text-blue-600 break-words">
                            <span className="link">{websiteUri}</span>
                        </Link>
                    </div>
                )}

                {parking && (
                    <div className="mb-4">
                        <span className="text-sm font-medium text-gray-500">Parking: </span>
                        <span className="text-gray-600">{parking}</span>
                    </div>
                )}
            </div>

            <div className="sm:w-1/2 sm:ml-6 sm:mt-0 mt-4">
                <div className="card p-6">
                    <h4 className="text-xl font-semibold text-gray-800 mb-2">Description</h4>
                    <div className="flex items-center text-gray-500 mb-4">
                        <h5 className="mr-2 text-sm font-medium">Time Zone:</h5>
                        <span className="text-sm font-light">{timeZone.id}</span>
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed">{description}</p>
                </div>
            </div>
        </div>
    );
}
