import { AxiosError } from 'axios';

export function catchErrorHandler(
    err: unknown,
    customMessage: string,
    setMessage?: React.Dispatch<React.SetStateAction<string>>,
): void {
    let errorMessage = customMessage;

    // Check if the error is an AxiosError
    if (err instanceof AxiosError) {
        // If it's an Axios error, use the response data message if available
        if (err.response?.data?.message) {
            errorMessage += `: ${err.response.data.message}`;
        } else {
            errorMessage += `: ${err.message}`;
        }
    } else if (err instanceof Error) {
        errorMessage += `: ${err.message}`;
    } else {
        errorMessage += `: Unknown error occurred`;
    }

    console.error(errorMessage);

    if (setMessage) {
        setMessage(errorMessage);
    }
}
