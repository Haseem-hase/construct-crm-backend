import jwt from "jsonwebtoken";
import type { StringValue } from "ms";

export interface AccessTokenPayload {
    userId: string;
    role: string;
}

const jwtSecret = process.env.JWT_SECRET;
const jwtAccessExpiresIn = process.env.JWT_ACCESS_EXPIRES_IN as StringValue;

if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured.");
}

if (!jwtAccessExpiresIn) {
    throw new Error("JWT_ACCESS_EXPIRES_IN is not configured.");
}

export const generateAccessToken = (
    payload: AccessTokenPayload
): string => {
    return jwt.sign(payload, jwtSecret, {
        expiresIn: jwtAccessExpiresIn,
    });
};

export const verifyAccessToken = (
    token: string
): AccessTokenPayload => {
    return jwt.verify(token, jwtSecret) as AccessTokenPayload;
};