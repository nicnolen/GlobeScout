// handler.ts

export const scheduleClearFiveDayForecastCache = async () => {
    const mod = await import('./utils/cron/weatherCrons');
    await mod.scheduleClearFiveDayForecastCache();
};

export const scheduleClearTopTenPlacesCache = async () => {
    const mod = await import('./utils/cron/googleMapsCrons');
    await mod.scheduleClearTopTenPlacesCache();
};

export const scheduleUpdateTopTenPlacesOpenNowStatus = async () => {
    const mod = await import('./utils/cron/googleMapsCrons');
    await mod.scheduleUpdateTopTenPlacesOpenNowStatus();
};
