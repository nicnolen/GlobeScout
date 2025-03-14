'use client';
import { Map } from '@vis.gl/react-google-maps';

export default function GlobeScoutMap() {
    return (
        <div className="w-full h-screen">
            <Map
                defaultZoom={5}
                defaultCenter={{ lat: 53, lng: 10 }}
                gestureHandling={'cooperative'}
                disableDefaultUI={false}
            />
        </div>
    );
}
