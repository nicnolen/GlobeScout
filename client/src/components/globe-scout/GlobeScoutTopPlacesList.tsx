import React, { JSX } from 'react';
import Link from 'next/link';
import { PlaceProps } from '../../../../types/googleMaps';
import { getPriceLevelColor, getPriceLevelSymbol } from '../../utils/priceLevel';

export default function TopPlacesList({
    rank,
    name,
    address,
    rating,
    userRatingCount,
    priceLevel,
}: PlaceProps): JSX.Element {
    return (
        <div className="card p-4 mb-4 flex items-start">
            <div className="flex-shrink-0 text-2xl font-bold text-gray-500 mr-4">{rank}.</div>

            <div className="flex-1">
                <div className="mb-4">
                    <h3 className="font-semibold text-xl">
                        {name}
                        {priceLevel !== undefined && (
                            <span className={`font-medium text-xl ${getPriceLevelColor(priceLevel)} ml-4`}>
                                {getPriceLevelSymbol(priceLevel)}
                            </span>
                        )}
                    </h3>
                    <Link href={`https://www.google.com/maps/search/?q=${name}`} target="_blank">
                        <span className="link">{address}</span>
                    </Link>
                </div>
                <div className="flex justify-between items-center">
                    <div>
                        <span className="font-medium">{rating} </span>
                        <span className="text-gray-500">({userRatingCount} reviews)</span>
                    </div>
                    <div className="flex items-center space-x-3"></div>
                </div>
            </div>
        </div>
    );
}
