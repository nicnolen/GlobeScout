'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../../redux/selectors/usersSelectors';
import { catchErrorHandler } from '../../../../utils/errorHandlers';

const TwoFactorSettings = () => {
    const [is2faEnabled, setIs2faEnabled] = useState<boolean>(false);
    const [isGoogleAuthEnabled, setIsGoogleAuthEnabled] = useState<boolean | null>();
    const [isEmailEnabled, setIsEmailEnabled] = useState<boolean | null>();
    const [message, setMessage] = useState<string | null>(null);

    const user = useSelector(selectUser);

    // Fetch 2FA status when the component mounts
    useEffect(() => {
        const fetch2FAStatus = async () => {
            try {
                if (!user) {
                    setMessage('No user found!');
                    return;
                }

                setIs2faEnabled(user.authentication.enabled);
                if (user.authentication.enabled) {
                    setIsGoogleAuthEnabled(user.authentication.methods.authenticator);
                    setIsEmailEnabled(user.authentication.methods.email);
                }
            } catch (err: unknown) {
                const customMessage = 'Error fetching 2fa status';
                catchErrorHandler(err, customMessage, setMessage);
            }
        };
        fetch2FAStatus();
    }, [user]);

    // Toggle 2FA (enable or disable)
    const toggle2FA = async (is2faEnabled?: boolean, isGoogleAuthEnabled?: boolean) => {
        try {
            const response = await axios.patch(
                '/toggle-2fa',
                { is2faEnabled, isGoogleAuthEnabled },
                { withCredentials: true },
            );
            setMessage(response.data.message);
            setIs2faEnabled(is2faEnabled); // Update state based on the toggle
        } catch (err: unknown) {
            const customMessage = 'Failed to update 2fa';
            catchErrorHandler(err, customMessage, setMessage);
        }
    };

    return (
        <div className="mt-6 text-gray-800">
            <h1 className="text-2xl font-semibold mb-4">2FA Settings</h1>
            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Enable 2FA</h2>
                <div className="flex items-center space-x-4">
                    <label htmlFor="2fa-toggle" className="text-lg">
                        2FA:
                    </label>
                    <input
                        type="checkbox"
                        id="2fa-toggle"
                        className="toggle"
                        checked={is2faEnabled}
                        onChange={() => toggle2FA(!is2faEnabled)}
                    />
                </div>

                {is2faEnabled ? (
                    <div className="space-y-4 mt-4">
                        <p className="text-sm">2FA is enabled. Options:</p>
                        <div className="space-y-2">
                            <p className="flex items-center">
                                Google Authenticator:{' '}
                                <span className={`ml-2 ${isGoogleAuthEnabled ? 'text-green-500' : 'text-red-500'}`}>
                                    {isGoogleAuthEnabled ? '✅' : '❌'}
                                </span>
                                {!isGoogleAuthEnabled && (
                                    <button
                                        className="ml-2 text-blue-500 hover:text-blue-700"
                                        onClick={() => {
                                            toggle2FA(is2faEnabled, true);
                                        }}
                                    >
                                        Set up Google Authenticator
                                    </button>
                                )}
                            </p>
                            <p className="flex items-center">
                                Email:{' '}
                                <span className={`ml-2 ${isEmailEnabled ? 'text-green-500' : 'text-red-500'}`}>
                                    {isEmailEnabled ? '✅' : '❌'}
                                </span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4 mt-4">
                        <p className="text-sm">2FA is disabled. Enable 2FA to secure your account:</p>

                        {message && <p className="text-sm text-gray-600">{message}</p>}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TwoFactorSettings;
