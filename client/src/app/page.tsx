'use client';

import React, { JSX } from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../redux/selectors/usersSelectors';
import FeatureDescription from '../components/home/FeatureDescription';

export default function Home(): JSX.Element {
    const user = useSelector(selectUser);

    return (
        <div>
            <h1 className="pageTitle ">Welcome to GlobeScout</h1>
            <p className="mb-6">
                GlobeScout helps you explore new places by providing insights into top attractions and weather
                conditions for cities and countries around the world.
            </p>

            <FeatureDescription
                title="Globe Scout"
                description="Globe Scout lets you search for a city or country and discover the top 10 attractions in that area. You can also view the current weather conditions and a detailed 5-day forecast by clicking on the button with the weather icon and the current temperature to the left of the search bar."
                buttonText="Discover the Globe"
                buttonLink="/globe-scout"
            />

            <FeatureDescription
                title="Weather Forecast"
                description="Weather Forecast shows the current weather conditions and a 5-day forecast with daily temperature, conditions, and useful insights to help you plan your activities. Note that you must have searched a city or country from the Globe Scout page in order to access this page."
            />

            {user && user.role === 'admin' && (
                <FeatureDescription
                    title="Admin"
                    description="A list of users who have registered on GlobeScout"
                    buttonText="View Users"
                    buttonLink="/admin"
                />
            )}
        </div>
    );
}
