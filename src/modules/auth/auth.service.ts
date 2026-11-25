// Study: Apply business rules and coordinate database operations for account registration, sign-in, sign-out, and session token refresh.
// Study: Import `* as authRepository` from `"./auth.repository"`.
import * as authRepository from "./auth.repository";
// Study: Import `bcrypt` from `"bcrypt"`.
import bcrypt from "bcrypt";
// Study: Import `crypto` from `"crypto"`.
import crypto from "crypto";
// Study: Import `{ LoginInput, LoginResponse, MeResponse, RegisterCustomerInput }` from `"./auth.types"`.
import { LoginInput, LoginResponse, MeResponse, RegisterCustomerInput } from "./auth.types";
// Study: Import `{ ConflictError }` from `"../../errors/ConflictError"`.
import { ConflictError } from "../../errors/ConflictError";
// Study: Import `{ generateAccessToken, generateRefreshToken, verifyRefreshToken }` from `"../../utils/jwt.utils"`.
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.utils";
// Study: Import `{ UnauthorizedError }` from `"../../errors/UnauthorizedError"`.
import { UnauthorizedError } from "../../errors/UnauthorizedError";
// Study: Import `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"`.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Import `{ addDuration }` from `"../../utils/date.utils"`.
import { addDuration } from "../../utils/date.utils";
// Study: Import `{ getDurationEnv }` from `"../../utils/env.utils"`.
import { getDurationEnv } from "../../utils/env.utils";
// Study: Import `{ createRefreshToken, revokeRefreshToken }` from `"./refresh-token.repository"`.
import { createRefreshToken, revokeRefreshToken } from "./refresh-token.repository";
// Study: Import `{ findMatchingRefreshToken }` from `"./refresh-token.service"`.
import { findMatchingRefreshToken } from "./refresh-token.service";

// Study: Export `registerCustomer` as an async function that returns a promise.
export const registerCustomer = async (
    // Study: Accept `data` with type `RegisterCustomerInput`.
    data: RegisterCustomerInput
// Study: Close this group and continue the enclosing expression.
) => {

    // Study: Call `authRepository.findUserByEmail` and wait for it to finish and store its result in `existingUser`.
    const existingUser = await authRepository.findUserByEmail(
        // Study: Supply `data` to the surrounding statement.
        data.email
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `existingUser` is truthy.
    if (existingUser) {
        // Study: Stop this execution path by throwing `new ConflictError("Email already registered.")`.
        throw new ConflictError("Email already registered.");
    // Study: Close the code block.
    }

    // Study: Call `authRepository.findUserByPhone` and wait for it to finish and store its result in `existingPhone`.
    const existingPhone = await authRepository.findUserByPhone(
        // Study: Supply `data` to the surrounding statement.
        data.phone
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `existingPhone` is truthy.
    if (existingPhone) {
        // Study: Stop this execution path by throwing `new ConflictError("Phone number already registered")`.
        throw new ConflictError("Phone number already registered")
    // Study: Close the code block.
    }

    // Customer role is now handled per-organization, leaving empty for global registration


    // Study: Call `bcrypt.hash` and wait for it to finish and store its result in `hashedPassword`.
    const hashedPassword = await bcrypt.hash(
        // Study: Supply `data` to the surrounding statement.
        data.password,
        // Study: Set the bcrypt cost factor to 10 for this password hash.
        10
    // Study: Close the call arguments.
    );

    // Study: Call `authRepository.createUser` and wait for it to finish and store its result in `user`.
    const user = await authRepository.createUser({
        // Study: Set `fullName` to `data.fullName`.
        fullName: data.fullName,
        // Study: Set `email` to `data.email`.
        email: data.email,
        // Study: Set `phone` to `data.phone`.
        phone: data.phone,
        // Study: Set `password` to `hashedPassword`.
        password: hashedPassword,
    // Study: Close the object literal.
    });

    // Study: Set `{ password, ...userWithoutPassword }` to `user`.
    const { password, ...userWithoutPassword } = user;

    // Study: Return `userWithoutPassword` to the caller.
    return userWithoutPassword;
// Study: Close the code block.
};

//login
// Study: Export `login` as an async function that returns a promise.
export const login = async (
    // Study: Accept `data` with type `LoginInput`.
    data: LoginInput
// Study: Close this group and continue the enclosing expression.
): Promise<LoginResponse> => {

    // Study: Call `authRepository.findUserByEmail` and wait for it to finish and store its result in `user`.
    const user = await authRepository.findUserByEmail(data.email);

    // Study: Run the following branch when `!user` is truthy.
    if (!user) {
        // Study: Stop this execution path by throwing `new UnauthorizedError("Invalid email or password.")`.
        throw new UnauthorizedError("Invalid email or password.");
    // Study: Close the code block.
    }

    // Study: Call `bcrypt.compare` and wait for it to finish and store its result in `isPasswordValid`.
    const isPasswordValid = await bcrypt.compare(
        // Study: Supply `data` to the surrounding statement.
        data.password,
        // Study: Supply `user` to the surrounding statement.
        user.password
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `!isPasswordValid` is truthy.
    if (!isPasswordValid) {
        // Study: Stop this execution path by throwing `new UnauthorizedError("Invalid email or password.")`.
        throw new UnauthorizedError("Invalid email or password.");
    // Study: Close the code block.
    }

    // Study: Set `roleName` to `user.systemRole || user.organizationRole?.role.name || "USER"`.
    const roleName = user.systemRole || user.organizationRole?.role.name || "USER";

    // Study: Build the object `payload` with the entries below.
    const payload = {
        // Study: Set `userId` to `user.id`.
        userId: user.id,
        // Study: Set `role` to `roleName`.
        role: roleName,
    // Study: Close the object literal.
    };

    // Study: Call `generateAccessToken` and store the result as `accessToken`.
    const accessToken = generateAccessToken(payload);

    // Study: Call `generateRefreshToken` and store the result as `refreshToken`.
    const refreshToken = generateRefreshToken(payload);

    // Study: Call `bcrypt.hash` and wait for it to finish and store its result in `hashedRefreshToken`.
    const hashedRefreshToken = await bcrypt.hash(
        // Study: Call `crypto.createHash("sha256").update(refreshToken).digest`.
        crypto.createHash("sha256").update(refreshToken).digest("hex"), 10
    // Study: Close the call arguments.
    )

    // Study: Call `addDuration` and store the result as `expiresAt`.
    const expiresAt = addDuration(
        // Study: Call `getDurationEnv`.
        getDurationEnv("JWT_REFRESH_EXPIRES_IN")
    // Study: Close the call arguments.
    )

    // Study: Call `createRefreshToken` and wait for it to finish.
    await createRefreshToken({
        // Study: Set `hashedToken` to `hashedRefreshToken`.
        hashedToken: hashedRefreshToken,
        // Study: Set `userId` to `user.id`.
        userId: user.id,
        // Study: Pass the current `expiresAt` value under the same property name.
        expiresAt,
    // Study: Close the object literal.
    })

    // Study: Return `{ accessToken, refreshToken, user: { id: user.id, fullName: user.fullName, email: u…` to the caller.
    return {
        // Study: Pass the current `accessToken` value under the same property name.
        accessToken,
        // Study: Pass the current `refreshToken` value under the same property name.
        refreshToken,
        // Study: Start the nested value for `user`.
        user: {
            // Study: Set `id` to `user.id`.
            id: user.id,
            // Study: Set `fullName` to `user.fullName`.
            fullName: user.fullName,
            // Study: Set `email` to `user.email`.
            email: user.email,
            // Study: Set `role` to `roleName`.
            role: roleName,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    };
// Study: Close the code block.
};

//genrate new access token and refresh token using old refresh token
// Study: Export `refreshAccessToken` as an async function that returns a promise.
export const refreshAccessToken = async (
    // Study: Accept `refreshToken` with type `string`.
    refreshToken: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Call `verifyRefreshToken` and store the result as `payload`.
    const payload = verifyRefreshToken(refreshToken);

    // Study: Call `findMatchingRefreshToken` and wait for it to finish and store its result in `matchedToken`.
    const matchedToken = await findMatchingRefreshToken(
        // Study: Supply `refreshToken` to the surrounding statement.
        refreshToken,
        // Study: Supply `payload` to the surrounding statement.
        payload.userId
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `!matchedToken` is truthy.
    if (!matchedToken) {
        // Study: Stop this execution path by throwing `new UnauthorizedError("Invalid refresh token.")`.
        throw new UnauthorizedError("Invalid refresh token.");
    // Study: Close the code block.
    }

    // Study: Run the following branch when `matchedToken.revokedAt` is truthy.
    if (matchedToken.revokedAt) {
        // Study: Stop this execution path by throwing `new UnauthorizedError("Refresh token has been revoked.")`.
        throw new UnauthorizedError("Refresh token has been revoked.");
    // Study: Close the code block.
    }

    // Study: Run the following branch when `matchedToken.expiresAt <= new Date()` is truthy.
    if (matchedToken.expiresAt <= new Date()) {
        // Study: Stop this execution path by throwing `new UnauthorizedError("Refresh token has expired.")`.
        throw new UnauthorizedError("Refresh token has expired.");
    // Study: Close the code block.
    }

    // Study: Call `authRepository.findUserById` and wait for it to finish and store its result in `user`.
    const user = await authRepository.findUserById(payload.userId);

    // Study: Run the following branch when `!user` is truthy.
    if (!user) {
        // Study: Stop this execution path by throwing `new UnauthorizedError("User not found.")`.
        throw new UnauthorizedError("User not found.");
    // Study: Close the code block.
    }

    // Study: Call `revokeRefreshToken` and wait for it to finish.
    await revokeRefreshToken(matchedToken.id)

    // Study: Set `roleName` to `user.systemRole || user.organizationRole?.role.name || "USER"`.
    const roleName = user.systemRole || user.organizationRole?.role.name || "USER";

    // Study: Call `generateRefreshToken` and store the result as `newRefreshToken`.
    const newRefreshToken = generateRefreshToken({
        // Study: Set `userId` to `user.id`.
        userId: user.id,
        // Study: Set `role` to `roleName`.
        role: roleName,
    // Study: Close the object literal.
    });

    // Study: Call `bcrypt.hash` and wait for it to finish and store its result in `hashedRefreshToken`.
    const hashedRefreshToken = await bcrypt.hash(crypto.createHash("sha256").update(newRefreshToken).digest("hex"), 10);

    // Study: Call `addDuration` and store the result as `expiresAt`.
    const expiresAt = addDuration(
        // Study: Call `getDurationEnv`.
        getDurationEnv("JWT_REFRESH_EXPIRES_IN")
    // Study: Close the call arguments.
    )

    // Study: Call `createRefreshToken` and wait for it to finish.
    await createRefreshToken({
        // Study: Set `hashedToken` to `hashedRefreshToken`.
        hashedToken: hashedRefreshToken,
        // Study: Set `userId` to `user.id`.
        userId: user.id,
        // Study: Pass the current `expiresAt` value under the same property name.
        expiresAt,
    // Study: Close the object literal.
    });

    // Study: Call `generateAccessToken` and store the result as `accessToken`.
    const accessToken = generateAccessToken({
        // Study: Set `userId` to `user.id`.
        userId: user.id,
        // Study: Set `role` to `roleName`.
        role: roleName,
    // Study: Close the object literal.
    });

    // Study: Return `{ accessToken, refreshToken: newRefreshToken, }` to the caller.
    return {
        // Study: Pass the current `accessToken` value under the same property name.
        accessToken,
        // Study: Set `refreshToken` to `newRefreshToken`.
        refreshToken: newRefreshToken,
    // Study: Close the object literal.
    }


// Study: Close the code block.
};

//logout
// Study: Export `logout` as an async function that returns a promise.
export const logout = async (
    // Study: Accept `refreshToken` with type `string`.
    refreshToken: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Call `verifyRefreshToken` and store the result as `payload`.
    const payload = verifyRefreshToken(refreshToken);

    // Study: Call `findMatchingRefreshToken` and wait for it to finish and store its result in `matchedToken`.
    const matchedToken = await findMatchingRefreshToken(
        // Study: Supply `refreshToken` to the surrounding statement.
        refreshToken,
        // Study: Supply `payload` to the surrounding statement.
        payload.userId
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `!matchedToken` is truthy.
    if (!matchedToken) {
        // Study: Stop this execution path by throwing `new UnauthorizedError("Invalid refresh token.")`.
        throw new UnauthorizedError("Invalid refresh token.");
    // Study: Close the code block.
    }

    // Study: Run the following branch when `matchedToken.revokedAt` is truthy.
    if (matchedToken.revokedAt) {
        // Study: Stop this execution path by throwing `new UnauthorizedError("Refresh token has already been revoked")`.
        throw new UnauthorizedError("Refresh token has already been revoked");
    // Study: Close the code block.
    }

    // Study: Call `revokeRefreshToken` and wait for it to finish.
    await revokeRefreshToken(matchedToken.id);
// Study: Close the code block.
};


//get me 
// Study: Export `getMe` as an async function that returns a promise.
export const getMe = async (
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
): Promise<MeResponse> => {

    // Study: Return `{ user, }` to the caller.
    return {
        // Study: Pass the current `user` value under the same property name.
        user,
    // Study: Close the object literal.
    }
// Study: Close the code block.
};