// Study: Provide reusable date helpers for backend callers.
// Study: Bring in `ms, { StringValue }` from `"ms"` so this file can use it.
import ms, { StringValue } from "ms";

// Study: Set up a reusable step named `addDuration`.
export const addDuration = (
    // Study: This step receives `duration`. `StringValue` describes what that information should look like.
    duration: StringValue,
    // Study: This step receives `from`. `Date` with initial value `new Date()` describes what that information should look like.
    from: Date = new Date()
// Study: Finish this group and continue the surrounding step.
): Date => {
    // Study: Give `new Date(from.getTime() + ms(duration))` back to the code that asked for it.
    return new Date(from.getTime() + ms(duration));
// Study: Finish this group and continue the surrounding step.
};  //"Give me a date that is 7 days from now if 7d is inside addDuration("7d")"