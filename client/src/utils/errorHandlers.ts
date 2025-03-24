import { AxiosError } from 'axios';

export function catchErrorHandler(
    err: unknown,
    customMessage: string,
    setMessage?: React.Dispatch<React.SetStateAction<string>>,
): void {
    // Check if the error is an AxiosError
    if (err instanceof AxiosError) {
        // If it's an Axios error, use the response data message if available
        if (err.response && err.response.data && err.response.data.message) {
            console.error(`${customMessage}: ${err.response.data.message}`);
            setMessage(`${customMessage}: ${err.response.data.message}`);
        } else if (err instanceof Error) {
            console.error(`${customMessage}: ${err.message}`);
            setMessage(`${customMessage}: ${err.message}`);
        } else {
            console.error(`${customMessage}: ${err}`);
            setMessage(`${customMessage}: ${err}`);
        }
    }
}
