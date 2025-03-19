'use client';

import React, { JSX } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Units } from '../../../../types/weather';
import { selectUnits } from '../../redux/selectors/weatherSelectors';
import { setUnits } from '../../redux/slices/weatherSlice';

export default function SettingsDropdown(): JSX.Element {
    const units = useSelector(selectUnits);
    const dispatch = useDispatch();

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
        </div>
    );
}
