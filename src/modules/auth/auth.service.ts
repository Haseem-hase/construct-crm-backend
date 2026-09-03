import * as authRepository from "./auth.repository";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { LoginInput, LoginResponse, MeResponse, RegisterCustomerInput } from "./auth.types";
import { ConflictError } from "../../errors/ConflictError";
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.utils";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
import { addDuration } from "../../utils/date.utils";
import { getDurationEnv } from "../../utils/env.utils";
import { createRefreshToken, revokeRefreshToken } from "./refresh-token.repository";
import { findMatchingRefreshToken } from "./refresh-token.service";

export const registerCustomer = async (
    data: RegisterCustomerInput
) => {

    const existingUser = await authRepository.findUserByEmail(
        data.email
    );

    if (existingUser) {
        throw new ConflictError("Email already registered.");
    }

    const existingPhone = await authRepository.findUserByPhone(
        data.phone
    );

    if (existingPhone) {
        throw new ConflictError("Phone number already registered")
    }

    // Customer role is now handled per-organization, leaving empty for global registration


    const hashedPassword = await bcrypt.hash(
        data.password,
        10
    );

    const user = await authRepository.createUser({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = user;

    return {
        success: true,
        message: "Customer registered successfully.",
        data: userWithoutPassword,
    };
};

//login
export const login = async (
    data: LoginInput
): Promise<LoginResponse> => {

    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
        throw new UnauthorizedError("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
    );

    if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password.");
    }

    const roleName = user.systemRole || user.organizationRole?.role.name || "USER";

    const payload = {
        userId: user.id,
        role: roleName,
    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    const hashedRefreshToken = await bcrypt.hash(
        crypto.createHash("sha256").update(refreshToken).digest("hex"), 10
    )

    const expiresAt = addDuration(
        getDurationEnv("JWT_REFRESH_EXPIRES_IN")
    )

    await createRefreshToken({
        hashedToken: hashedRefreshToken,
        userId: user.id,
        expiresAt,
    })

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: roleName,
        },
    };
};

//genrate new access token and refresh token using old refresh token
export const refreshAccessToken = async (
    refreshToken: string
) => {
    const payload = verifyRefreshToken(refreshToken);

    const matchedToken = await findMatchingRefreshToken(
        refreshToken,
        payload.userId
    );

    if (!matchedToken) {
        throw new UnauthorizedError("Invalid refresh token.");
    }

    if (matchedToken.revokedAt) {
        throw new UnauthorizedError("Refresh token has been revoked.");
    }

    if (matchedToken.expiresAt <= new Date()) {
        throw new UnauthorizedError("Refresh token has expired.");
    }

    const user = await authRepository.findUserById(payload.userId);

    if (!user) {
        throw new UnauthorizedError("User not found.");
    }

    await revokeRefreshToken(matchedToken.id)

    const roleName = user.systemRole || user.organizationRole?.role.name || "USER";

    const newRefreshToken = generateRefreshToken({
        userId: user.id,
        role: roleName,
    });

    const hashedRefreshToken = await bcrypt.hash(crypto.createHash("sha256").update(newRefreshToken).digest("hex"), 10);

    const expiresAt = addDuration(
        getDurationEnv("JWT_REFRESH_EXPIRES_IN")
    )

    await createRefreshToken({
        hashedToken: hashedRefreshToken,
        userId: user.id,
        expiresAt,
    });

    const accessToken = generateAccessToken({
        userId: user.id,
        role: roleName,
    });

    return {
        accessToken,
        refreshToken: newRefreshToken,
    }


};

//logout
export const logout = async (
    refreshToken: string
) => {
    const payload = verifyRefreshToken(refreshToken);

    const matchedToken = await findMatchingRefreshToken(
        refreshToken,
        payload.userId
    );

    if (!matchedToken) {
        throw new UnauthorizedError("Invalid refresh token.");
    }

    if (matchedToken.revokedAt) {
        throw new UnauthorizedError("Refresh token has already been revoked");
    }

    await revokeRefreshToken(matchedToken.id);

    return {
        message: "Logged out successfully."
    };
};


//get me 
export const getMe = async (
    user: AuthenticatedUser
): Promise<MeResponse> => {

    return {
        user,
    }
};