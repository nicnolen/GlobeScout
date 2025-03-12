import React, { JSX } from 'react';

interface GlobeScoutTitleProps {
    city: string;
    message: string;
}

export default function GlobeScoutTitle({ city, message }: GlobeScoutTitleProps): JSX.Element {
    return (
        <div>
            {city && !message && <h1>{city}</h1>}
            {message && <p>{message}</p>}
        </div>
    );
}
