export function catchErrorHandler(
    err: unknown,
    customMessage: string,
    setMessage: React.Dispatch<React.SetStateAction<string>>,
): void {
    if (err instanceof Error) {
        console.error(`${customMessage}: ${err.message}`);
        setTimeout(() => {
            setMessage(`${customMessage}: ${err.message}`);
        }, 5000);
    } else {
        console.error(`${customMessage}: ${err}`);
        setTimeout(() => {
            setMessage(`${customMessage}: ${err}`);
        }, 5000);
    }
}
