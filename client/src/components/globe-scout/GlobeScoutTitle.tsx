import React, { JSX } from 'react';
import { GlobeScoutTitleProps } from '../../types/globeScout';

export default function GlobeScoutTitle({ city, message }: GlobeScoutTitleProps): JSX.Element {
    return (
        <div>
            {city && !message && <h1>{city}</h1>}
            {message && <p>{message}</p>}
        </div>
    );
}
