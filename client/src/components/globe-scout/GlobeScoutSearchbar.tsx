import React, { JSX } from 'react';
import { useDispatch } from 'react-redux';
import { GlobeScoutSearchbarProps } from '../../types/globeScout';
import { setCity } from '../../redux/slices/weatherSlice';

export default function GlobeScoutSearchbar({ city }: GlobeScoutSearchbarProps): JSX.Element {
    const dispatch = useDispatch();

    return (
        <input
            type="text"
            value={city}
            onChange={(e) => dispatch(setCity(e.target.value))}
            placeholder="Enter city"
            className="flex-grow border border-gray-300 p-2 px-4 rounded-md mr-2.5"
        />
    );
}
