import React, { useEffect } from 'react';

interface UseGetGoogleMapsApiKeyProps {
    setApiKey: React.Dispatch<React.SetStateAction<string | null>>;
}

export const useGetGoogleMapsApiKey = ({ setApiKey }: UseGetGoogleMapsApiKeyProps): void => {
    useEffect(() => {
        const fetchApiKey = async () => {
            try {
                const response = await fetch('/api/google-maps-key');
                const data = await response.json();
                setApiKey(data.apiKey);
            } catch (error) {
                console.error('Error fetching API key:', error);
            }
        };

        fetchApiKey();
    }, []); // eslint-disable-line  react-hooks/exhaustive-deps
};
