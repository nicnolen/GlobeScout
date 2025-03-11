import React, { JSX } from 'react';
import { GlobeScoutSearchbarProps } from '../../types/globeScout';

export default function GlobeScoutSearchbar({ city, setCity }: GlobeScoutSearchbarProps): JSX.Element {
    return (
        <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            className="flex-grow border border-gray-300 p-2 px-4 rounded-md mr-2.5"
        />
    );
}
