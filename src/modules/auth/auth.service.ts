// Study: This file is about signing in, signing out, creating an account, and staying signed in. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `* as authRepository` from `"./auth.repository"` so this file can use it.
import * as authRepository from "./auth.repository";
// Study: Bring in `bcrypt` from `"bcrypt"` so this file can use it.
import bcrypt from "bcrypt";
// Study: Bring in `crypto` from `"crypto"` so this file can use it.
import crypto from "crypto";
// Study: Bring in `{ LoginInput, LoginResponse, MeResponse, RegisterCustomerInput }` from `"./auth.types"` so this file can use it.
import { LoginInput, LoginResponse, MeResponse, RegisterCustomerInput } from "./auth.types";
// Study: Bring in `{ ConflictError }` from `"../../errors/ConflictError"` so this file can use it.
import { ConflictError } from "../../errors/ConflictError";
// Study: Bring in `{ generateAccessToken, generateRefreshToken, verifyRefreshToken }` from `"../../utils/jwt.utils"` so this file can use it.
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from "../../utils/jwt.utils";
// Study: Bring in `{ UnauthorizedError }` from `"../../errors/UnauthorizedError"` so this file can use it.
import { UnauthorizedError } from "../../errors/UnauthorizedError";
// Study: Bring in `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"` so this file can use it.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Bring in `{ addDuration }` from `"../../utils/date.utils"` so this file can use it.
import { addDuration } from "../../utils/date.utils";
// Study: Bring in `{ getDurationEnv }` from `"../../utils/env.utils"` so this file can use it.
import { getDurationEnv } from "../../utils/env.utils";
// Study: Bring in `{ createRefreshToken, revokeRefreshToken }` from `"./refresh-token.repository"` so this file can use it.
import { createRefreshToken, revokeRefreshToken } from "./refresh-token.repository";
// Study: Bring in `{ findMatchingRefreshToken }` from `"./refresh-token.service"` so this file can use it.
import { findMatchingRefreshToken } from "./refresh-token.service";

// Study: Make `registerCustomer` available to other files. Its result arrives after its work finishes.
export const registerCustomer = async (
    // Study: This step receives `data`. `RegisterCustomerInput` describes what that information should look like.
    data: RegisterCustomerInput
// Study: Finish this group and continue the surrounding step.
) => {

    // Study: Check whether this email address already belongs to an account before creating another one.
    const existingUser = await authRepository.findUserByEmail(
        // Study: Use the email that was submitted for this step.
        data.email
    // Study: End the list of information being sent to this step.
    );

    // Study: Use the next step if an account with that email was found.
    if (existingUser) {
        // Study: Stop here and report this problem: "Email already registered."
        throw new ConflictError("Email already registered.");
    // Study: End this group of steps.
    }

    // Study: Check whether this phone number is already registered.
    const existingPhone = await authRepository.findUserByPhone(
        // Study: Use the phone that was submitted for this step.
        data.phone
    // Study: End the list of information being sent to this step.
    );

    // Study: Use the next step if an account with that phone number was found.
    if (existingPhone) {
        // Study: Stop here and report this problem: "Phone number already registered".
        throw new ConflictError("Phone number already registered")
    // Study: End this group of steps.
    }

    // Customer role is now handled per-organization, leaving empty for global registration


    // Study: Scramble the password into a one-way fingerprint so the original password does not have to be stored.
    const hashedPassword = await bcrypt.hash(
        // Study: Use the password that was submitted for this step.
        data.password,
        // Study: Use 10 as bcrypt’s work setting. Higher settings take longer to calculate and make password guessing slower.
        10
    // Study: End the list of information being sent to this step.
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
    // Study: End this group of values.
    });

    // Study: Take the password field out of the account information before sending the account details back.
    const { password, ...userWithoutPassword } = user;

    // Study: Give `userWithoutPassword` back to the code that asked for it.
    return userWithoutPassword;
// Study: End this group of steps.
};

//login
// Study: Make `login` available to other files. Its result arrives after its work finishes.
export const login = async (
    // Study: This step receives `data`. `LoginInput` describes what that information should look like.
    data: LoginInput
// Study: Finish this group and continue the surrounding step.
): Promise<LoginResponse> => {

    // Study: Call `authRepository.findUserByEmail` and wait for it to finish and store its result in `user`.
    const user = await authRepository.findUserByEmail(data.email);

    // Study: Do the next step if there is no value for `user`.
    if (!user) {
        // Study: Stop here and report this problem: "Invalid email or password."
        throw new UnauthorizedError("Invalid email or password.");
    // Study: End this group of steps.
    }

    // Study: Call `bcrypt.compare` and wait for it to finish and store its result in `isPasswordValid`.
    const isPasswordValid = await bcrypt.compare(
        // Study: Use the password that was submitted for this step.
        data.password,
        // Study: Supply `user` to the surrounding statement.
        user.password
    // Study: End the list of information being sent to this step.
    );

    // Study: Do the next step if there is no value for `isPasswordValid`.
    if (!isPasswordValid) {
        // Study: Stop here and report this problem: "Invalid email or password."
        throw new UnauthorizedError("Invalid email or password.");
    // Study: End this group of steps.
    }

    // Study: Set `roleName` to `user.systemRole || user.organizationRole?.role.name || "USER"`.
    const roleName = user.systemRole || user.organizationRole?.role.name || "USER";

    // Study: Build the object `payload` with the entries below.
    const payload = {
        // Study: Set `userId` to `user.id`.
        userId: user.id,
        // Study: Set `role` to `roleName`.
        role: roleName,
    // Study: End this group of values.
    };

    // Study: Call `generateAccessToken` and store the result as `accessToken`.
    const accessToken = generateAccessToken(payload);

    // Study: Call `generateRefreshToken` and store the result as `refreshToken`.
    const refreshToken = generateRefreshToken(payload);

    // Study: Call `bcrypt.hash` and wait for it to finish and store its result in `hashedRefreshToken`.
    const hashedRefreshToken = await bcrypt.hash(
        // Study: Call `crypto.createHash("sha256").update(refreshToken).digest`.
        crypto.createHash("sha256").update(refreshToken).digest("hex"), 10
    // Study: End the list of information being sent to this step.
    )

    // Study: Call `addDuration` and store the result as `expiresAt`.
    const expiresAt = addDuration(
        // Study: Call `getDurationEnv`.
        getDurationEnv("JWT_REFRESH_EXPIRES_IN")
    // Study: End the list of information being sent to this step.
    )

    // Study: Call `createRefreshToken` and wait for it to finish.
    await createRefreshToken({
        // Study: Set `hashedToken` to `hashedRefreshToken`.
        hashedToken: hashedRefreshToken,
        // Study: Set `userId` to `user.id`.
        userId: user.id,
        // Study: Carry the value of `expiresAt` into the new group under the same name.
        expiresAt,
    // Study: End this group of values.
    })

    // Study: Give `{ accessToken, refreshToken, user: { id: user.id, fullName: user.fullName, email: u…` back to the code that asked for it.
    return {
        // Study: Carry the value of `accessToken` into the new group under the same name.
        accessToken,
        // Study: Carry the value of `refreshToken` into the new group under the same name.
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
        // Study: End this group of values.
        },
    // Study: End this group of values.
    };
// Study: End this group of steps.
};

//genrate new access token and refresh token using old refresh token
// Study: Make `refreshAccessToken` available to other files. Its result arrives after its work finishes.
export const refreshAccessToken = async (
    // Study: This step receives `refreshToken`. `string` describes what that information should look like.
    refreshToken: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Call `verifyRefreshToken` and store the result as `payload`.
    const payload = verifyRefreshToken(refreshToken);

    // Study: Call `findMatchingRefreshToken` and wait for it to finish and store its result in `matchedToken`.
    const matchedToken = await findMatchingRefreshToken(
        // Study: Supply `refreshToken` to the surrounding statement.
        refreshToken,
        // Study: Supply `payload` to the surrounding statement.
        payload.userId
    // Study: End the list of information being sent to this step.
    );

    // Study: Do the next step if there is no value for `matchedToken`.
    if (!matchedToken) {
        // Study: Stop here and report this problem: "Invalid refresh token."
        throw new UnauthorizedError("Invalid refresh token.");
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `matchedToken.revokedAt`.
    if (matchedToken.revokedAt) {
        // Study: Stop here and report this problem: "Refresh token has been revoked."
        throw new UnauthorizedError("Refresh token has been revoked.");
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `matchedToken.expiresAt <= new Date()`.
    if (matchedToken.expiresAt <= new Date()) {
        // Study: Stop here and report this problem: "Refresh token has expired."
        throw new UnauthorizedError("Refresh token has expired.");
    // Study: End this group of steps.
    }

    // Study: Call `authRepository.findUserById` and wait for it to finish and store its result in `user`.
    const user = await authRepository.findUserById(payload.userId);

    // Study: Do the next step if there is no value for `user`.
    if (!user) {
        // Study: Stop here and report this problem: "User not found."
        throw new UnauthorizedError("User not found.");
    // Study: End this group of steps.
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
    // Study: End this group of values.
    });

    // Study: Call `bcrypt.hash` and wait for it to finish and store its result in `hashedRefreshToken`.
    const hashedRefreshToken = await bcrypt.hash(crypto.createHash("sha256").update(newRefreshToken).digest("hex"), 10);

    // Study: Call `addDuration` and store the result as `expiresAt`.
    const expiresAt = addDuration(
        // Study: Call `getDurationEnv`.
        getDurationEnv("JWT_REFRESH_EXPIRES_IN")
    // Study: End the list of information being sent to this step.
    )

    // Study: Call `createRefreshToken` and wait for it to finish.
    await createRefreshToken({
        // Study: Set `hashedToken` to `hashedRefreshToken`.
        hashedToken: hashedRefreshToken,
        // Study: Set `userId` to `user.id`.
        userId: user.id,
        // Study: Carry the value of `expiresAt` into the new group under the same name.
        expiresAt,
    // Study: End this group of values.
    });

    // Study: Call `generateAccessToken` and store the result as `accessToken`.
    const accessToken = generateAccessToken({
        // Study: Set `userId` to `user.id`.
        userId: user.id,
        // Study: Set `role` to `roleName`.
        role: roleName,
    // Study: End this group of values.
    });

    // Study: Give `{ accessToken, refreshToken: newRefreshToken, }` back to the code that asked for it.
    return {
        // Study: Carry the value of `accessToken` into the new group under the same name.
        accessToken,
        // Study: Set `refreshToken` to `newRefreshToken`.
        refreshToken: newRefreshToken,
    // Study: End this group of values.
    }


// Study: End this group of steps.
};

//logout
// Study: Make `logout` available to other files. Its result arrives after its work finishes.
export const logout = async (
    // Study: This step receives `refreshToken`. `string` describes what that information should look like.
    refreshToken: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Call `verifyRefreshToken` and store the result as `payload`.
    const payload = verifyRefreshToken(refreshToken);

    // Study: Call `findMatchingRefreshToken` and wait for it to finish and store its result in `matchedToken`.
    const matchedToken = await findMatchingRefreshToken(
        // Study: Supply `refreshToken` to the surrounding statement.
        refreshToken,
        // Study: Supply `payload` to the surrounding statement.
        payload.userId
    // Study: End the list of information being sent to this step.
    );

    // Study: Do the next step if there is no value for `matchedToken`.
    if (!matchedToken) {
        // Study: Stop here and report this problem: "Invalid refresh token."
        throw new UnauthorizedError("Invalid refresh token.");
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `matchedToken.revokedAt`.
    if (matchedToken.revokedAt) {
        // Study: Stop here and report this problem: "Refresh token has already been revoked".
        throw new UnauthorizedError("Refresh token has already been revoked");
    // Study: End this group of steps.
    }

    // Study: Call `revokeRefreshToken` and wait for it to finish.
    await revokeRefreshToken(matchedToken.id);
// Study: End this group of steps.
};


//get me 
// Study: Make `getMe` available to other files. Its result arrives after its work finishes.
export const getMe = async (
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
): Promise<MeResponse> => {

    // Study: Give `{ user, }` back to the code that asked for it.
    return {
        // Study: Carry the value of `user` into the new group under the same name.
        user,
    // Study: End this group of values.
    }
// Study: End this group of steps.
};