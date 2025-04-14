import { useState, useEffect } from 'react';
import { UserData } from '../types/users';
import { catchErrorHandler } from '../utils/errorHandlers';

export function useFetch2faStatus(user: UserData) {
    const [is2faEnabled, setIs2faEnabled] = useState(false);
    const [isGoogleAuthEnabled, setIsGoogleAuthEnabled] = useState(false);
    const [message, setMessage] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const fetch2faStatus = async () => {
            try {
                setIsUpdating(true);
                if (!user) {
                    setMessage('No user found!');
                    setIsUpdating(false);
                    return;
                }

                setIs2faEnabled(user.authentication.enabled);
                setIsGoogleAuthEnabled(user.authentication.methods.authenticator);
                if (!user.authentication.enabled) {
                    setMessage('2FA has been disabled');
                }

                setIsUpdating(false);
            } catch (err) {
                const customMessage = 'Error fetching 2FA status';
                catchErrorHandler(err, customMessage, setMessage);
                setIsUpdating(false);
            }
        };

        fetch2faStatus();
    }, [user]);

    return {
        is2faEnabled,
        setIs2faEnabled,
        isGoogleAuthEnabled,
        setIsGoogleAuthEnabled,
        message,
        setMessage,
        isUpdating,
        setIsUpdating,
    };
}
