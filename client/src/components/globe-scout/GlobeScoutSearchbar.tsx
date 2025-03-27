import React, { JSX } from 'react';
import { useDispatch } from 'react-redux';
import { setLocation } from '../../redux/slices/weatherSlice';

export interface GlobeScoutSearchbarProps {
    location: string;
}

export default function GlobeScoutSearchbar({ location }: GlobeScoutSearchbarProps): JSX.Element {
    const dispatch = useDispatch();

    return (
        <input
            type="text"
            value={location}
            onChange={(e) => dispatch(setLocation(e.target.value))}
            placeholder="Enter location name. Seperate a city and a country with a ,"
            className="w-full border border-gray-300 bg-white p-2 px-4 rounded-md mr-2.5"
        />
    );
}
