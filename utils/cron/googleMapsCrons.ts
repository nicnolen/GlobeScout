import cron from 'node-cron';
import TopTenPlacesCache from '../../models/TopTenPlacesCache';
import { catchErrorHandler } from '../errorHandlers';

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
