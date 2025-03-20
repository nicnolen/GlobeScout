import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { PlaceProps } from '../types/googleMaps';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

export function checkOpenNowStatus(place: PlaceProps): string {
    const { regularOpeningHours, timeZone } = place;
    if (!regularOpeningHours?.weekdayDescriptions) {
        return 'Daily hours not available';
    }

    const now = dayjs().utc().tz(timeZone.id);
    const currentDay = now.format('dddd');

    const todayHours = regularOpeningHours.weekdayDescriptions.find((day) => day.startsWith(currentDay));

    if (!todayHours) {
        return 'Daily hours not available';
    }

    const hoursText = todayHours.split(': ')[1]?.trim();

    if (hoursText === 'Closed') {
        return 'Closed';
    }

    if (hoursText === 'Open 24 hours') {
        return 'Open 24 hours';
    }

    // Process multiple time ranges
    const timeRanges = hoursText.split(',').map((range) => range.trim());

    // Check if the place is open
    for (const range of timeRanges) {
        let [openTimeStr, closeTimeStr] = range.split('–').map((time) => time.trim());
        // Closing time will always have AM/PM
        const closeMeridian = closeTimeStr.match(/AM|PM/)?.[0];

        // If opening time is missing AM/PM, use closing time's AM/PM
        if (!openTimeStr.includes('AM') && !openTimeStr.includes('PM')) {
            openTimeStr += ` ${closeMeridian}`;
        }

        // Parse the opening and closing times in the correct format
        let openingTime = dayjs.tz(openTimeStr, 'h:mm A', timeZone.id);
        let closingTime = dayjs.tz(closeTimeStr, 'h:mm A', timeZone.id);

        // Adjust for closing after midnight
        if (closingTime.isBefore(openingTime)) {
            closingTime = closingTime.add(1, 'day');
        }

        // Check if we are within the open hours range
        const isOpenNow = now.isAfter(openingTime) && now.isBefore(closingTime);

        if (isOpenNow) {
            // Check for "Opening Soon" or "Closing Soon" conditions
            if (now.isBefore(openingTime.subtract(1, 'hour'))) {
                return 'Opening Soon';
            } else if (now.isAfter(closingTime.subtract(1, 'hour')) && now.isBefore(closingTime)) {
                // Ensure that it’s within 1 hour of closing
                return 'Closing Soon';
            } else {
                return 'Open';
            }
        }
    }

    return 'Closed';
}
