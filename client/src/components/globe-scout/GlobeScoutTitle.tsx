import React, { JSX } from 'react';

interface GlobeScoutTitleProps {
    locationSearch: string;
    message: string;
}

export default function GlobeScoutTitle({ locationSearch, message }: GlobeScoutTitleProps): JSX.Element {
    return (
        <div>
            {locationSearch && !message && <h1>{locationSearch}</h1>}
            {message && <p>{message}</p>}
        </div>
    );
}
