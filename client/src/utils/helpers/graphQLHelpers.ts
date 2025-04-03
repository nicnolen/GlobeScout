export function removeFields<T extends object>(obj: T, fieldsToRemove: string[]): T {
    return Object.fromEntries(Object.entries(obj).filter(([key]) => !fieldsToRemove.includes(key))) as T;
}
