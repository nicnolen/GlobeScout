import React, { JSX } from 'react';
import { GlobeScoutSearchbarProps } from '../../../../types/globeScout';

export default function GlobeScoutSearchbar({ city, setCity }: GlobeScoutSearchbarProps): JSX.Element {
    return (
        <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter city"
            style={{
                flexGrow: 1,
                border: '1px solid #ccc',
                padding: '8px 15px',
                borderRadius: '5px',
                marginRight: '10px',
            }}
        />
    );
}
