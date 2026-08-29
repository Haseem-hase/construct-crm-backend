import ms, { StringValue } from "ms";

export const addDuration = (
    duration: StringValue,
    from: Date = new Date()
): Date => {
    return new Date(from.getTime() + ms(duration));
};  //"Give me a date that is 7 days from now if 7d is inside addDuration("7d")"