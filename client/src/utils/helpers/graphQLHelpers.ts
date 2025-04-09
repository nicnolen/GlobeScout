export function removeFields<T extends object>(obj: T, fieldsToRemove: string[]): T {
    return Object.fromEntries(
        Object.entries(obj)
            .filter(([key]) => !fieldsToRemove.includes(key)) // Filter out keys to remove
            .map(
                ([key, value]) =>
                    value && typeof value === 'object'
                        ? [key, removeFields(value, fieldsToRemove)] // Recursively apply for objects
                        : [key, value], // Keep other values as is
            ),
    ) as T;
}
