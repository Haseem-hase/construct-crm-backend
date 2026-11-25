// Study: This file is about signing in, signing out, creating an account, and staying signed in. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `bcrypt` from `"bcrypt"` so this file can use it.
import bcrypt from "bcrypt";
// Study: Bring in `crypto` from `"crypto"` so this file can use it.
import crypto from "crypto";

// Study: Bring in `{ findRefreshTokensByUserId, }` from `"./refresh-token.repository"` so this file can use it.
import {
    // Study: Make `findRefreshTokensByUserId` from the other file available here.
    findRefreshTokensByUserId,
// Study: Finish this group and continue the surrounding step.
} from "./refresh-token.repository";

// Study: Make `findMatchingRefreshToken` available to other files. Its result arrives after its work finishes.
export const findMatchingRefreshToken = async (
    // Study: This step receives `refreshToken`. `string` describes what that information should look like.
    refreshToken: string,
    // Study: This step receives `userId`. `string` describes what that information should look like.
    userId: string
// Study: Finish this group and continue the surrounding step.
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
        // Study: End the list of information being sent to this step.
        );

        // Study: Do the next step if this check passes: `matches`.
        if (matches) {
            // Study: Give `storedToken` back to the code that asked for it.
            return storedToken;
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Study: Give `null` back to the code that asked for it.
    return null;
// Study: End this group of steps.
};