import UsersModel from '../../models/users/Users';
import { catchErrorHandler } from '../../utils/errorHandlers';

export async function incrementRequestCount(email: string, apiName: string): Promise<void> {
    try {
        if (!email) {
            throw new Error('User email is required');
        }

        if (!apiName) {
            throw new Error('API name is required');
        }

        const user = await UsersModel.findOne({ email: email });

        if (!user) {
            throw new Error('User not found');
        }

        const api = user.services[apiName];

        if (!api) {
            throw new Error(`API service ${apiName} not found`);
        }

        // Check if making the request would exceed the maxRequests limit
        if (api.requestsMade >= api.maxRequests) {
            throw new Error(`${apiName} request limit reached: ${api.requestsMade}/${api.maxRequests} requests made.`);
        }

        // Increment the requestsMade count for the API if it is within the limit
        await UsersModel.findByIdAndUpdate(
            user.id,
            {
                $inc: { [`services.${apiName}.requestsMade`]: 1 }, // Increment the requestsMade count
            },
            { new: true },
        );
    } catch (err: unknown) {
        const customMessage = 'Error updating the requestsMade count for OpenWeather API';
        catchErrorHandler(err, customMessage);
        throw err;
    }
}
