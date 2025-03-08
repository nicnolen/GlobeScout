import React, { JSX } from 'react';
import { GlobeScoutTitleProps } from '../../../../types/globeScout';

export default function GlobeScoutTitle({ city, loading, error }: GlobeScoutTitleProps): JSX.Element {
    return (
        <div>
            {city && !loading && !error && <h1>{city}</h1>}
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
        </div>
    );
}
