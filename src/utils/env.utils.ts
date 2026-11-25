// Study: Read required environment values for application configuration.
// Study: Import `{ StringValue }` from `"ms"`.
import { StringValue } from "ms";

// Study: Export `getEnv` as a reusable function.
export const getEnv = (key: string): string => {
    // Study: Set `value` to `process.env[key]`.
    const value = process.env[key];

    // Study: Run the following branch when `!value` is truthy.
    if (!value) {
        // Study: Stop this execution path by throwing `new Error('${key} is not configured.')`.
        throw new Error(`${key} is not configured.`);
    // Study: Close the code block.
    }

    // Study: Return `value` to the caller.
    return value;
// Study: Close the code block.
};

// Study: Export `getDurationEnv` as a reusable function.
export const getDurationEnv = (
    // Study: Accept `key` with type `string`.
    key: string
// Study: Close this group and continue the enclosing expression.
): StringValue => {
    // Study: Return `getEnv(key) as StringValue` to the caller.
    return getEnv(key) as StringValue;
// Study: Close the code block.
};