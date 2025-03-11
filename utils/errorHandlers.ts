export function catchErrorHandler(err: unknown, customMessage: string): void {
    if (err instanceof Error) {
        console.error(`${customMessage}: ${err.message}`);
    } else {
        console.error(`${customMessage}: ${err}`);
    }
}
