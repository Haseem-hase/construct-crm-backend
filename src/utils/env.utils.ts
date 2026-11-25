// Study: Read required environment values for application configuration.
// Study: Bring in `{ StringValue }` from `"ms"` so this file can use it.
import { StringValue } from "ms";

// Study: Set up a reusable step named `getEnv`.
export const getEnv = (key: string): string => {
    // Study: Set `value` to `process.env[key]`.
    const value = process.env[key];

    // Study: Do the next step if there is no value for `value`.
    if (!value) {
        // Study: Stop here and pass the problem onward: `new Error('${key} is not configured.')`.
        throw new Error(`${key} is not configured.`);
    // Study: End this group of steps.
    }

    // Study: Give `value` back to the code that asked for it.
    return value;
// Study: End this group of steps.
};

// Study: Set up a reusable step named `getDurationEnv`.
export const getDurationEnv = (
    // Study: This step receives `key`. `string` describes what that information should look like.
    key: string
// Study: Finish this group and continue the surrounding step.
): StringValue => {
    // Study: Give `getEnv(key) as StringValue` back to the code that asked for it.
    return getEnv(key) as StringValue;
// Study: End this group of steps.
};