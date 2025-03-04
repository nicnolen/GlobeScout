import React, { JSX } from 'react';
import FeatureDescription from '../components/FeatureDescription';

export default function Home(): JSX.Element {
    return (
        <>
            <h1 className="text-3xl font-bold mb-4">Welcome to CityZen</h1>
            <p className="mb-6">
                CityZen helps you explore new places by providing insights into top attractions and weather conditions
                for cities and countries around the world.
            </p>

            {/* City Explorer Feature */}
            <FeatureDescription
                title="City Explorer"
                description="City Explorer lets you search for a city or country and discover the top 10 attractions in that area. You can also view the current weather and navigate to the Weather Page for a detailed 5-day forecast."
                buttonText="Explore Cities"
                buttonLink="/cityexplorer"
            />

            {/* Weather Page Feature */}
            <FeatureDescription
                title="Weather Forecast"
                description="Weather Forecast shows a 5-day forecast with daily temperature, conditions, and useful insights to help you plan your activities."
                buttonText="View Weather Forecast"
                buttonLink="/weather"
            />
        </>
    );
}
