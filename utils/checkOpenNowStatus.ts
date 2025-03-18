import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { PlaceProps } from '../types/googleMaps';

dayjs.extend(utc);
dayjs.extend(timezone);

// Helper function to calculate the "openNow" status for a place
export function checkOpenNowStatus(place: PlaceProps): string {
    const { regularOpeningHours } = place;
    const now = dayjs().utc();
    const currentDay = now.format('dddd'); // e.g., "Monday"

    const todayHours = regularOpeningHours?.weekdayDescriptions?.find((day) => day.startsWith(currentDay));

    if (!todayHours) {
        return 'Daily hours not available';
    }

    const hours = todayHours.substring(todayHours.indexOf(':') + 1).trim();

    if (hours === 'Open 24 hours') {
        return 'Open 24 hours';
    }

    if (hours === 'Closed') {
        return 'Closed';
    }

    const [openTimeStr, closeTimeStr] = hours.split('–').map((time) => time.trim());

    const openingTime = dayjs.utc(openTimeStr, 'hh:mm A');
    let closingTime = dayjs.utc(closeTimeStr, 'hh:mm A');

    // Adjust for midnight closing (if closing time is 12:00 AM, it's the next day)
    if (closingTime.hour() === 0 && closingTime.minute() === 0) {
        closingTime = closingTime.add(1, 'day');
    }

    // Determine if the place is currently open
    if (now.isBefore(openingTime)) {
        return now.add(1, 'hour').isAfter(openingTime) ? 'Opening Soon' : 'Closed';
    } else if (now.isAfter(closingTime)) {
        return 'Closed';
    } else if (now.add(1, 'hour').isAfter(closingTime)) {
        return 'Closing Soon';
    } else {
        return 'Open';
    }
}
