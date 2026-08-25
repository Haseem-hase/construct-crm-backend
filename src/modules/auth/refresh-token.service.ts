import bcrypt from "bcrypt";
import crypto from "crypto";

import {
    findRefreshTokensByUserId,
} from "./refresh-token.repository";

export const findMatchingRefreshToken = async (
    refreshToken: string,
    userId: string
) => {
    const hashedInput = crypto
        .createHash("sha256")
        .update(refreshToken)
        .digest("hex");

    const storedTokens =
        await findRefreshTokensByUserId(userId);

    for (const storedToken of storedTokens) {
        const matches = await bcrypt.compare(
            hashedInput,
            storedToken.token
        );

        if (matches) {
            return storedToken;
        }
    }

    return null;
};