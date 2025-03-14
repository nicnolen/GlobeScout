'use client';
import { useState } from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import { useGetGoogleMapsApiKey } from '../../hooks/apiKeyHooks';

export default function GoogleMapProvider({ children }: React.ComponentProps<typeof APIProvider>) {
    const [apiKey, setApiKey] = useState<string | null>(null);

    useGetGoogleMapsApiKey({ setApiKey });

    return (
        <>
            {apiKey && (
                <APIProvider apiKey={apiKey} libraries={['geometry']}>
                    {children}
                </APIProvider>
            )}
        </>
    );
}
