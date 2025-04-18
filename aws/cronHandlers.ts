import FiveDayForecastCache from '../models/caches/FiveDayForecastCache';
import TopTenPlacesCache from '../models/caches/TopTenPlacesCache';
import { checkOpenNowStatus } from '../utils/checkOpenNowStatus';
import { catchErrorHandler } from '../utils/errorHandlers';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import connectToMongoDB from '../config/mongoDB/db';

dayjs.extend(utc);

export const clearFiveDayForecastCacheHandler = async () => {
    try {
        await connectToMongoDB();
        console.info('Starting cache clearing job for 5-day forecast...');
        await FiveDayForecastCache.deleteMany({});
        console.info('Successfully cleared the 5-day forecast cache.');
    } catch (err: unknown) {
        const customMessage = `Error clearing the 5-day forecast cache: ${err}`;
        catchErrorHandler(err, customMessage);
    }
};

export const clearTopTenPlacesCacheHandler = async () => {
    try {
        await connectToMongoDB();
        // Calculate 48 hours ago from the current date
        const dateThreshold = new Date();
        dateThreshold.setHours(dateThreshold.getHours() - 48);

        const result = await TopTenPlacesCache.deleteMany({
            createdAt: { $lt: dateThreshold },
        });

        console.info(`Successfully cleared ${result.deletedCount} records from top_ten_places collection`);
    } catch (err: unknown) {
        const customMessage = `Error clearing the top_ten_places collection: ${err}`;
        catchErrorHandler(err, customMessage);
    }
};

export const updateTopTenPlacesOpenNowStatusHandler = async () => {
    try {
        await connectToMongoDB();
        // Get the current time and subtract 15 minutes to filter documents
        const fifteenMinutesAgo = dayjs().subtract(15, 'minutes').toISOString();

        // Fetch only the documents where updatedAt is older than 15 minutes
        const allPlaceCaches = await TopTenPlacesCache.find({
            updatedAt: { $lte: fifteenMinutesAgo }, // Filter by updatedAt field
        });

        if (allPlaceCaches && allPlaceCaches.length > 0) {
            // Loop through each placeCache (document)
            for (const placeCache of allPlaceCaches) {
                if (placeCache.topTenPlaces) {
                    // Loop through each place in the topTenPlaces array and update openNow status
                    placeCache.topTenPlaces.forEach((placeObj: any) => {
                        // Ensure regularOpeningHours exists before attempting to access openNow
                        if (placeObj.regularOpeningHours) {
                            const openNowStatus = checkOpenNowStatus(placeObj); // Get the openNow status
                            placeObj.regularOpeningHours.openNow = openNowStatus; // Update openNow field
                        }
                    });

                    // Update the document with the new topTenPlaces array
                    await TopTenPlacesCache.findOneAndUpdate(
                        { _id: placeCache._id }, // Find the document by its _id
                        { topTenPlaces: placeCache.topTenPlaces }, // Update the topTenPlaces array
                        { new: true }, // Return the updated document
                    );
                }
            }
        } else {
            console.info('No documents need updating');
        }

        console.info('openNow status update complete');
    } catch (err: unknown) {
        const customMessage = 'Error running cron job for openNow status update';
        catchErrorHandler(err, customMessage);
    }
};
