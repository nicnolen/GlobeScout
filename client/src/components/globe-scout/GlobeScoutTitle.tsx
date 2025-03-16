import React, { JSX } from 'react';

interface GlobeScoutTitleProps {
    location: string;
    message: string;
}

export default function GlobeScoutTitle({ location, message }: GlobeScoutTitleProps): JSX.Element {
    return (
        <div>
            {location && !message && <h1>{location}</h1>}
            {message && <p>{message}</p>}
        </div>
    );
}
