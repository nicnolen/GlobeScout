export function errorHandler(err: unknown, customMessage: string) {
    if (err instanceof Error) {
        console.error(`${customMessage}: ${err.message}`);
    } else {
        console.error(`${customMessage}: ${err}`);
    }
}
