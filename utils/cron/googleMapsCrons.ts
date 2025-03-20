import cron from 'node-cron';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { PlaceProps } from '../../types/googleMaps';
import TopTenPlacesCache from '../../models/caches/TopTenPlacesCache';
import { checkOpenNowStatus } from '../../utils/checkOpenNowStatus';
import { catchErrorHandler } from '../errorHandlers';

dayjs.extend(utc);

// Clear top_ten_places_cache collection at midnight after 2 days
export function scheduleClearTopTenPlacesCache(): void {
    cron.schedule('0 0 */2 * *', async () => {
        try {
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
    });
}

// Update each place's openNow status in top_ten_places_cache collection every 15 minutes
export function scheduleUpdateTopTenPlacesOpenNowStatus(): void {
    cron.schedule('*/15 * * * *', async () => {
        try {
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
                        placeCache.topTenPlaces.forEach((placeObj: PlaceProps) => {
                            // Ensure regularOpeningHours exists before attempting to access openNow
                            if (placeObj.regularOpeningHours) {
                                const openNowStatus = checkOpenNowStatus(placeObj); // Get the openNow status for each place
                                placeObj.regularOpeningHours.openNow = openNowStatus; // Update openNow field (boolean)
                            }
                        });

                        // Update the document with the new topTenPlaces array
                        await TopTenPlacesCache.findOneAndUpdate(
                            { _id: placeCache._id }, // Find the document by its _id
                            { topTenPlaces: placeCache.topTenPlaces }, // Update only the topTenPlaces array
                            { new: true }, // Return the updated document
                        );
                    }
                }
            } else {
                console.info('No documents need updating');
            }

            console.info('openNow status update complete');
        } catch (error) {
            console.error('Error in cron job to update openNow status:', error);
            const customMessage = `Error running cron job for openNow status update: ${error}`;
            catchErrorHandler(error, customMessage);
        }
    });
}
