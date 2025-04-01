'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../../../redux/selectors/usersSelectors';
import { setUser } from '../../../../redux/slices/usersSlice';
import { catchErrorHandler } from '../../../../utils/errorHandlers';

export default function TwoFactorSettings() {
    const [is2faEnabled, setIs2faEnabled] = useState<boolean>(false);
    const [isGoogleAuthEnabled, setIsGoogleAuthEnabled] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');
    const dispatch = useDispatch();

    const user = useSelector(selectUser);

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
            } catch (err: unknown) {
                const customMessage = 'Error fetching 2FA status';
                catchErrorHandler(err, customMessage, setMessage);
                setIsUpdating(false);
            }
        };
        fetch2faStatus();
    }, [user]);

    const toggle2fa = async (is2faEnabled: boolean) => {
        try {
            setMessage('');
            setIsUpdating(true);
            const response = await axios.patch('/toggle-2fa', { is2faEnabled }, { withCredentials: true });

            if (!response.data.message.includes('enabled')) {
                setMessage(response.data.message);
            }

            const updatedUser = {
                ...user,
                authentication: {
                    ...user.authentication,
                    enabled: is2faEnabled,
                },
            };
            dispatch(setUser(updatedUser));

            setIs2faEnabled(is2faEnabled);
            setIsUpdating(false);
        } catch (err: unknown) {
            const customMessage = 'Failed to update 2FA';
            catchErrorHandler(err, customMessage, setMessage);
            setIsUpdating(false);
        }
    };

    const toggle2faMethod = async (isGoogleAuthEnabled: boolean) => {
        try {
            setIsUpdating(true);
            const response = await axios.patch(
                '/toggle-2fa-method',
                { isGoogleAuthEnabled },
                { withCredentials: true },
            );

            setMessage(response.data.message);
            setIsGoogleAuthEnabled(isGoogleAuthEnabled);
            setIsUpdating(false);
        } catch (err: unknown) {
            const customMessage = 'Failed to update 2FA methods';
            catchErrorHandler(err, customMessage, setMessage);
            setIsUpdating(false);
        }
    };

    return (
        <>
            <h1 className="text-xl font-semibold text-gray-800">2FA Settings</h1>
            <div className=" text-gray-800 space-y-4">
                <div className="flex items-center">
                    <span className="text-sm">Enable 2FA:</span>
                    <button
                        className={`p-2 rounded-full ${is2faEnabled ? 'text-green-500' : 'text-gray-500'}`}
                        onClick={() => toggle2fa(!is2faEnabled)}
                        disabled={isUpdating}
                    >
                        <i className={is2faEnabled ? 'fas fa-toggle-on text-2xl' : 'fas fa-toggle-off text-2xl'} />
                    </button>
                </div>

                {is2faEnabled && (
                    <div className="space-y-4">
                        <p className="text-sm">2FA is enabled. Choose your preferred method:</p>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 border rounded">
                                <span>Google Authenticator</span>
                                <i
                                    className={`text-xl ${isUpdating ? <i className="fa-solid fa-spinner text-xl text-blue-500 animate-spin" /> : isGoogleAuthEnabled ? 'text-green-500 fas fa-check-circle' : 'text-red-500 fas fa-times-circle'}`}
                                />
                                {!isGoogleAuthEnabled && (
                                    <button
                                        className="button primaryButton"
                                        onClick={() => toggle2faMethod(true)}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? (
                                            <i className="fa-solid fa-spinner text-xl text-blue-500 animate-spin" />
                                        ) : (
                                            <i className="fas fa-qrcode mr-1" />
                                        )}{' '}
                                        Set up Google Authenticator
                                    </button>
                                )}
                            </div>
                            <div className="flex items-center justify-between p-2 border rounded">
                                <span>Email Authentication</span>
                                {isUpdating ? (
                                    <i className="fa-solid fa-spinner text-xl text-blue-500 animate-spin" />
                                ) : (
                                    <i className="text-xl text-green-500 fas fa-check-circle" />
                                )}
                            </div>
                        </div>
                    </div>
                )}
                {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
            </div>
        </>
    );
}
