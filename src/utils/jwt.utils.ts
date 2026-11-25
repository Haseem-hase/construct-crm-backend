// Study: Provide helpers for creating and verifying JSON Web Tokens (JWTs).
// Study: Bring in `jwt` from `"jsonwebtoken"` so this file can use it.
import jwt from "jsonwebtoken";
// Study: Bring in `{ getEnv }` from `"./env.utils"` so this file can use it.
import { getEnv } from "./env.utils";

// Study: Describe which information `TokenPayload` can contain so TypeScript can catch mistakes while checking the code.
export interface TokenPayload {
    // Study: Define `userId` with type `string`.
    userId: string;
    // Study: Define `role` with type `string`.
    role: string;
// Study: Close the interface declaration.
}

// Study: Call `getEnv` and store the result as `jwtAccessSecret`.
const jwtAccessSecret = getEnv("JWT_SECRET");
// Study: Call `getEnv` and store the result as `jwtRefreshSecret`.
const jwtRefreshSecret = getEnv("JWT_REFRESH_SECRET");

// Study: Call `getEnv` and store the result as `jwtAccessExpiresIn`.
const jwtAccessExpiresIn = getEnv("JWT_ACCESS_EXPIRES_IN");
// Study: Call `getEnv` and store the result as `jwtRefreshExpiresIn`.
const jwtRefreshExpiresIn = getEnv("JWT_REFRESH_EXPIRES_IN");

/**
 * Private helper for generating JWTs
 */
// Study: Set up a reusable step named `generateToken`.
const generateToken = (
    // Study: This step receives `payload`. `TokenPayload` describes what that information should look like.
    payload: TokenPayload,
    // Study: This step receives `secret`. `string` describes what that information should look like.
    secret: string,
    // Study: This step receives `expiresIn`. `string` describes what that information should look like.
    expiresIn: string
// Study: Finish this group and continue the surrounding step.
): string => {
    // Study: Give `jwt.sign(payload, secret, { expiresIn, } as jwt.SignOptions)` back to the code that asked for it.
    return jwt.sign(payload, secret, {
        // Study: Carry the value of `expiresIn` into the new group under the same name.
        expiresIn,
    // Study: Finish this group and continue the surrounding step.
    } as jwt.SignOptions);
// Study: End this group of steps.
};

/**
 * Private helper for verifying JWTs
 */
// Study: Set up a reusable step named `verifyToken`.
const verifyToken = (
    // Study: This step receives `token`. `string` describes what that information should look like.
    token: string,
    // Study: This step receives `secret`. `string` describes what that information should look like.
    secret: string
// Study: Finish this group and continue the surrounding step.
): TokenPayload => {
    // Study: Give `jwt.verify(token, secret) as TokenPayload` back to the code that asked for it.
    return jwt.verify(token, secret) as TokenPayload;
// Study: End this group of steps.
};

/**
 * Generate Access Token
 */
// Study: Set up a reusable step named `generateAccessToken`.
export const generateAccessToken = (
    // Study: This step receives `payload`. `TokenPayload` describes what that information should look like.
    payload: TokenPayload
// Study: Finish this group and continue the surrounding step.
): string => {
    // Study: Give `generateToken( payload, jwtAccessSecret, jwtAccessExpiresIn )` back to the code that asked for it.
    return generateToken(
        // Study: Supply `payload` to the surrounding statement.
        payload,
        // Study: Supply `jwtAccessSecret` to the surrounding statement.
        jwtAccessSecret,
        // Study: Supply `jwtAccessExpiresIn` to the surrounding statement.
        jwtAccessExpiresIn
    // Study: End the list of information being sent to this step.
    );
// Study: End this group of steps.
};

/**
 * Generate Refresh Token
 */
// Study: Set up a reusable step named `generateRefreshToken`.
export const generateRefreshToken = (
    // Study: This step receives `payload`. `TokenPayload` describes what that information should look like.
    payload: TokenPayload
// Study: Finish this group and continue the surrounding step.
): string => {
    // Study: Give `generateToken( payload, jwtRefreshSecret, jwtRefreshExpiresIn )` back to the code that asked for it.
    return generateToken(
        // Study: Supply `payload` to the surrounding statement.
        payload,
        // Study: Supply `jwtRefreshSecret` to the surrounding statement.
        jwtRefreshSecret,
        // Study: Supply `jwtRefreshExpiresIn` to the surrounding statement.
        jwtRefreshExpiresIn
    // Study: End the list of information being sent to this step.
    );
// Study: End this group of steps.
};

/**
 * Verify Access Token
 */
// Study: Set up a reusable step named `verifyAccessToken`.
export const verifyAccessToken = (
    // Study: This step receives `token`. `string` describes what that information should look like.
    token: string
// Study: Finish this group and continue the surrounding step.
): TokenPayload => {
    // Study: Give `verifyToken( token, jwtAccessSecret )` back to the code that asked for it.
    return verifyToken(
        // Study: Supply `token` to the surrounding statement.
        token,
        // Study: Supply `jwtAccessSecret` to the surrounding statement.
        jwtAccessSecret
    // Study: End the list of information being sent to this step.
    );
// Study: End this group of steps.
};

/**
 * Verify Refresh Token
 */
// Study: Set up a reusable step named `verifyRefreshToken`.
export const verifyRefreshToken = (
    // Study: This step receives `token`. `string` describes what that information should look like.
    token: string
// Study: Finish this group and continue the surrounding step.
): TokenPayload => {
    // Study: Give `verifyToken( token, jwtRefreshSecret )` back to the code that asked for it.
    return verifyToken(
        // Study: Supply `token` to the surrounding statement.
        token,
        // Study: Supply `jwtRefreshSecret` to the surrounding statement.
        jwtRefreshSecret
    // Study: End the list of information being sent to this step.
    );
// Study: End this group of steps.
};