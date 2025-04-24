import React, { JSX } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Units } from '../../../../../../types/weather';
import { selectUnits } from '../../../../redux/selectors/weatherSelectors';
import { setUnits } from '../../../../redux/slices/weatherSlice';
import TwoFactorAuthSettings from './TwoFactorAuthSettings';
import api from '../../../../utils/apiHandler';
import { catchErrorHandler } from '../../../../utils/errorHandlers';

export default function SettingsDropdown(): JSX.Element {
    const units = useSelector(selectUnits);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await api.post('/logout', {}, { withCredentials: true });

            if (response.status === 200) {
                setTimeout(() => router.push('/login'), 200);
            }
        } catch (err: unknown) {
            const customMessage = 'Error during logout';
            catchErrorHandler(err, customMessage);
        }
    };

    return (
        <div className="m-4">
            <p className="text-xl font-semibold text-gray-800">Units</p>

            <div className="flex space-x-2">
                <button
                    onClick={() => dispatch(setUnits(Units.Metric))}
                    className={`button text-sm py-2 px-4 ${units === Units.Metric ? 'primaryButton' : 'secondaryButton'}`}
                >
                    Metric
                </button>

                <button
                    onClick={() => dispatch(setUnits(Units.Imperial))}
                    className={`button text-sm py-2 px-4 ${units === Units.Imperial ? 'primaryButton' : 'secondaryButton'}`}
                >
                    Imperial
                </button>
            </div>

            <div className="mt-4">
                2FA Settings
                <TwoFactorAuthSettings />
            </div>

            <div className="mt-4">
                <button onClick={handleLogout} className="button dangerButton py-2 px-4 text-sm">
                    Logout
                </button>
            </div>
        </div>
    );
}
