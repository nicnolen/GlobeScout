import React, { JSX } from 'react';
import { useDispatch } from 'react-redux';
import { setLocationSearch } from '../../redux/slices/weatherSlice';

export interface GlobeScoutSearchbarProps {
    locationSearch: string;
}

export default function GlobeScoutSearchbar({ locationSearch }: GlobeScoutSearchbarProps): JSX.Element {
    const dispatch = useDispatch();

    return (
        <input
            type="text"
            value={locationSearch}
            onChange={(e) => dispatch(setLocationSearch(e.target.value))}
            placeholder="Enter location name. Seperate a city and a country with a ,"
            className="input w-full"
        />
    );
}
