import React, { JSX } from 'react';
import FeatureDescription from '../components/home/FeatureDescription';

export default function Home(): JSX.Element {
    return (
        <>
            <h1 className="text-3xl font-bold mb-4">Welcome to GlobeScout</h1>
            <p className="mb-6">
                GlobeScout helps you explore new places by providing insights into top attractions and weather
                conditions for cities and countries around the world.
            </p>

            {/* Globe Scout Feature */}
            <FeatureDescription
                title="Globe Scout"
                description="Globe Scout lets you search for a city or country and discover the top 10 attractions in that area. You can also view the current weather and navigate to the Weather Page for a detailed 5-day forecast."
                buttonText="Discover the Globe"
                buttonLink="/globe-scout"
            />

            {/* Weather Page Feature */}
            <FeatureDescription
                title="Weather Forecast"
                description="Weather Forecast shows a 5-day forecast with daily temperature, conditions, and useful insights to help you plan your activities. Note that you must have searched a city or country from the Globe Scout page in order to access this page."
            />

            {/* Users Page */}
            {/* TODO: ONLY ENABLE THIS FOR USERS THAT ARE ADMINS */}
            <FeatureDescription
                title="Users"
                description="A list of users who have registered on GlobeScout"
                buttonText=" View Users"
                buttonLink="/users"
            />
        </>
    );
}
