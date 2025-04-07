import { AxiosError } from 'axios';

export function catchErrorHandler(err: unknown, customMessage: string): string {
    let finalMessage = `${customMessage}: Unknown error occurred`;

    if (err instanceof AxiosError) {
        if (err.response?.data?.message) {
            finalMessage = `${customMessage}: ${err.response.data.message}`;
        } else {
            finalMessage = `${customMessage}: ${err.message}`;
        }
    } else if (err instanceof Error) {
        finalMessage = `${customMessage}: ${err.message}`;
    }

    console.error(finalMessage);
    return finalMessage;
}
