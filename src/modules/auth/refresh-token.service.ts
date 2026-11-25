// Study: Apply business rules and coordinate database operations for account registration, sign-in, sign-out, and session token refresh.
// Study: Import `bcrypt` from `"bcrypt"`.
import bcrypt from "bcrypt";
// Study: Import `crypto` from `"crypto"`.
import crypto from "crypto";

// Study: Import `{ findRefreshTokensByUserId, }` from `"./refresh-token.repository"`.
import {
    // Study: Bring `findRefreshTokensByUserId` into scope from the imported module.
    findRefreshTokensByUserId,
// Study: Close this group and continue the enclosing expression.
} from "./refresh-token.repository";

// Study: Export `findMatchingRefreshToken` as an async function that returns a promise.
export const findMatchingRefreshToken = async (
    // Study: Accept `refreshToken` with type `string`.
    refreshToken: string,
    // Study: Accept `userId` with type `string`.
    userId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Call `crypto .createHash("sha256") .update(refreshToken) .digest` and store the result as `hashedInput`.
    const hashedInput = crypto
        // Study: Continue the chain with `createHash`.
        .createHash("sha256")
        // Study: Continue the chain with `update`.
        .update(refreshToken)
        // Study: Continue the chain with `digest`.
        .digest("hex");

    // Study: Call `findRefreshTokensByUserId` and wait for it to finish and store its result in `storedTokens`.
    const storedTokens =
        // Study: Call `findRefreshTokensByUserId` and wait for it to finish.
        await findRefreshTokensByUserId(userId);

    // Study: Iterate over each item from `storedTokens` using `const storedToken`.
    for (const storedToken of storedTokens) {
        // Study: Call `bcrypt.compare` and wait for it to finish and store its result in `matches`.
        const matches = await bcrypt.compare(
            // Study: Supply `hashedInput` to the surrounding statement.
            hashedInput,
            // Study: Supply `storedToken` to the surrounding statement.
            storedToken.token
        // Study: Close the call arguments.
        );

        // Study: Run the following branch when `matches` is truthy.
        if (matches) {
            // Study: Return `storedToken` to the caller.
            return storedToken;
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Study: Return `null` to the caller.
    return null;
// Study: Close the code block.
};