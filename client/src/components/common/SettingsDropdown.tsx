'use client';

import React, { JSX } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { Units } from '../../../../types/weather';
import { selectUnits } from '../../redux/selectors/weatherSelectors';
import { setUnits } from '../../redux/slices/weatherSlice';
import { catchErrorHandler } from '../../utils/errorHandlers';

export default function SettingsDropdown(): JSX.Element {
    const units = useSelector(selectUnits);
    const dispatch = useDispatch();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const response = await axios.post('/logout', {}, { withCredentials: true });

            if (response.status === 200) {
                router.push('/login');
            }
        } catch (err: unknown) {
            const customMessage = 'Error during logout';
            catchErrorHandler(err, customMessage);
        }
    };

    return (
        <div className="card absolute p-4">
            <p className="settingsTitle">Units</p>

            <div className="flex space-x-4">
                <button
                    onClick={() => dispatch(setUnits(Units.Metric))}
                    className={`button text-sm ${
                        units === Units.Metric ? 'primaryButton' : 'lightGrayButton'
                    } primaryButtonHover`}
                >
                    Metric
                </button>

                <button
                    onClick={() => dispatch(setUnits(Units.Imperial))}
                    className={`button text-sm ${
                        units === Units.Imperial ? 'primaryButton' : 'lightGrayButton'
                    } primaryButtonHover`}
                >
                    Imperial
                </button>
            </div>
            <div className="mt-4">
                <button onClick={handleLogout} className="button text-sm lightGrayButton primaryButtonHover">
                    Logout
                </button>
            </div>
        </div>
    );
}
