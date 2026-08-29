import { StringValue } from "ms";

export const getEnv = (key: string): string => {
    const value = process.env[key];

    if (!value) {
        throw new Error(`${key} is not configured.`);
    }

    return value;
};

export const getDurationEnv = (
    key: string
): StringValue => {
    return getEnv(key) as StringValue;
};