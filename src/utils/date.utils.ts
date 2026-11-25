// Study: Provide reusable date helpers for backend callers.
// Study: Import `ms, { StringValue }` from `"ms"`.
import ms, { StringValue } from "ms";

// Study: Export `addDuration` as a reusable function.
export const addDuration = (
    // Study: Accept `duration` with type `StringValue`.
    duration: StringValue,
    // Study: Accept `from` with type `Date` with initial value `new Date()`.
    from: Date = new Date()
// Study: Close this group and continue the enclosing expression.
): Date => {
    // Study: Return `new Date(from.getTime() + ms(duration))` to the caller.
    return new Date(from.getTime() + ms(duration));
// Study: Close this group and continue the enclosing expression.
};  //"Give me a date that is 7 days from now if 7d is inside addDuration("7d")"