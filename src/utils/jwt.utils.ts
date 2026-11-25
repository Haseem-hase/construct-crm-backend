// Study: Provide helpers for creating and verifying JSON Web Tokens (JWTs).
// Study: Import `jwt` from `"jsonwebtoken"`.
import jwt from "jsonwebtoken";
// Study: Import `{ getEnv }` from `"./env.utils"`.
import { getEnv } from "./env.utils";

// Study: Define the compile-time contract named `TokenPayload`.
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
// Study: Define `generateToken` as a reusable function.
const generateToken = (
    // Study: Accept `payload` with type `TokenPayload`.
    payload: TokenPayload,
    // Study: Accept `secret` with type `string`.
    secret: string,
    // Study: Accept `expiresIn` with type `string`.
    expiresIn: string
// Study: Close this group and continue the enclosing expression.
): string => {
    // Study: Return `jwt.sign(payload, secret, { expiresIn, } as jwt.SignOptions)` to the caller.
    return jwt.sign(payload, secret, {
        // Study: Pass the current `expiresIn` value under the same property name.
        expiresIn,
    // Study: Close this group and continue the enclosing expression.
    } as jwt.SignOptions);
// Study: Close the code block.
};

/**
 * Private helper for verifying JWTs
 */
// Study: Define `verifyToken` as a reusable function.
const verifyToken = (
    // Study: Accept `token` with type `string`.
    token: string,
    // Study: Accept `secret` with type `string`.
    secret: string
// Study: Close this group and continue the enclosing expression.
): TokenPayload => {
    // Study: Return `jwt.verify(token, secret) as TokenPayload` to the caller.
    return jwt.verify(token, secret) as TokenPayload;
// Study: Close the code block.
};

/**
 * Generate Access Token
 */
// Study: Export `generateAccessToken` as a reusable function.
export const generateAccessToken = (
    // Study: Accept `payload` with type `TokenPayload`.
    payload: TokenPayload
// Study: Close this group and continue the enclosing expression.
): string => {
    // Study: Return `generateToken( payload, jwtAccessSecret, jwtAccessExpiresIn )` to the caller.
    return generateToken(
        // Study: Supply `payload` to the surrounding statement.
        payload,
        // Study: Supply `jwtAccessSecret` to the surrounding statement.
        jwtAccessSecret,
        // Study: Supply `jwtAccessExpiresIn` to the surrounding statement.
        jwtAccessExpiresIn
    // Study: Close the call arguments.
    );
// Study: Close the code block.
};

/**
 * Generate Refresh Token
 */
// Study: Export `generateRefreshToken` as a reusable function.
export const generateRefreshToken = (
    // Study: Accept `payload` with type `TokenPayload`.
    payload: TokenPayload
// Study: Close this group and continue the enclosing expression.
): string => {
    // Study: Return `generateToken( payload, jwtRefreshSecret, jwtRefreshExpiresIn )` to the caller.
    return generateToken(
        // Study: Supply `payload` to the surrounding statement.
        payload,
        // Study: Supply `jwtRefreshSecret` to the surrounding statement.
        jwtRefreshSecret,
        // Study: Supply `jwtRefreshExpiresIn` to the surrounding statement.
        jwtRefreshExpiresIn
    // Study: Close the call arguments.
    );
// Study: Close the code block.
};

/**
 * Verify Access Token
 */
// Study: Export `verifyAccessToken` as a reusable function.
export const verifyAccessToken = (
    // Study: Accept `token` with type `string`.
    token: string
// Study: Close this group and continue the enclosing expression.
): TokenPayload => {
    // Study: Return `verifyToken( token, jwtAccessSecret )` to the caller.
    return verifyToken(
        // Study: Supply `token` to the surrounding statement.
        token,
        // Study: Supply `jwtAccessSecret` to the surrounding statement.
        jwtAccessSecret
    // Study: Close the call arguments.
    );
// Study: Close the code block.
};

/**
 * Verify Refresh Token
 */
// Study: Export `verifyRefreshToken` as a reusable function.
export const verifyRefreshToken = (
    // Study: Accept `token` with type `string`.
    token: string
// Study: Close this group and continue the enclosing expression.
): TokenPayload => {
    // Study: Return `verifyToken( token, jwtRefreshSecret )` to the caller.
    return verifyToken(
        // Study: Supply `token` to the surrounding statement.
        token,
        // Study: Supply `jwtRefreshSecret` to the surrounding statement.
        jwtRefreshSecret
    // Study: Close the call arguments.
    );
// Study: Close the code block.
};