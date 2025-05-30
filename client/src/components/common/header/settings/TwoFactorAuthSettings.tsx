import { JSX } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser } from '../../../../redux/selectors/usersSelectors';
import { setUser } from '../../../../redux/slices/usersSlice';
import { useFetch2faStatus } from '../../../../hooks/2faHooks';
import api from '../../../../utils/apiHandler';
import { catchErrorHandler } from '../../../../utils/errorHandlers';

export default function TwoFactorSettings(): JSX.Element {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);

    const {
        is2faEnabled,
        setIs2faEnabled,
        isGoogleAuthEnabled,
        setIsGoogleAuthEnabled,
        message,
        setMessage,
        isUpdating,
        setIsUpdating,
    } = useFetch2faStatus(user);

    const toggle2fa = async (is2faEnabled: boolean) => {
        try {
            setMessage('');
            setIsUpdating(true);
            const response = await api.patch('/toggle-2fa', { is2faEnabled }, { withCredentials: true });

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
            const response = await api.patch('/toggle-2fa-method', { isGoogleAuthEnabled }, { withCredentials: true });

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
                                <span>Authenticator</span>
                                <i
                                    className={`text-xl ${isUpdating ? <i className="fa-solid fa-spinner text-xl text-blue-500 animate-spin" /> : isGoogleAuthEnabled ? 'text-green-500 fas fa-check-circle' : 'text-red-500 fas fa-times-circle'}`}
                                />
                                {!isGoogleAuthEnabled && (
                                    <button
                                        className="button primaryButton py-2 px-4"
                                        onClick={() => toggle2faMethod(true)}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? (
                                            <i className="fa-solid fa-spinner text-xl text-blue-500 animate-spin" />
                                        ) : (
                                            <i className="fas fa-qrcode mr-1" />
                                        )}{' '}
                                        Set up Authenticator
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
