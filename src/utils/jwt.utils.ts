import jwt from "jsonwebtoken";
import { getEnv } from "./env.utils";

export interface TokenPayload {
    userId: string;
    role: string;
}

const jwtAccessSecret = getEnv("JWT_SECRET");
const jwtRefreshSecret = getEnv("JWT_REFRESH_SECRET");

const jwtAccessExpiresIn = getEnv("JWT_ACCESS_EXPIRES_IN");
const jwtRefreshExpiresIn = getEnv("JWT_REFRESH_EXPIRES_IN");

/**
 * Private helper for generating JWTs
 */
const generateToken = (
    payload: TokenPayload,
    secret: string,
    expiresIn: string
): string => {
    return jwt.sign(payload, secret, {
        expiresIn,
    } as jwt.SignOptions);
};

/**
 * Private helper for verifying JWTs
 */
const verifyToken = (
    token: string,
    secret: string
): TokenPayload => {
    return jwt.verify(token, secret) as TokenPayload;
};

/**
 * Generate Access Token
 */
export const generateAccessToken = (
    payload: TokenPayload
): string => {
    return generateToken(
        payload,
        jwtAccessSecret,
        jwtAccessExpiresIn
    );
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (
    payload: TokenPayload
): string => {
    return generateToken(
        payload,
        jwtRefreshSecret,
        jwtRefreshExpiresIn
    );
};

/**
 * Verify Access Token
 */
export const verifyAccessToken = (
    token: string
): TokenPayload => {
    return verifyToken(
        token,
        jwtAccessSecret
    );
};

/**
 * Verify Refresh Token
 */
export const verifyRefreshToken = (
    token: string
): TokenPayload => {
    return verifyToken(
        token,
        jwtRefreshSecret
    );
};