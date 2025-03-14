import cron from 'node-cron';
import FiveDayForecast from '../../models/FiveDayForecastCache';
import { catchErrorHandler } from '../errorHandlers';

// Clear five_day_forecast_cache collection at midnight
export function scheduleClearFiveDayForecastCache(): void {
    cron.schedule('0 0 * * *', async () => {
        try {
            await FiveDayForecast.deleteMany({});
            console.info('Successfully cleared the current_weather collection');
        } catch (err: unknown) {
            const customMessage = `Error clearing the current_weather collection: ${err}`;
            catchErrorHandler(err, customMessage);
        }
    });
}
