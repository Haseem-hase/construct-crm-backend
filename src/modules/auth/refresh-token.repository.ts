// Study: This file is about signing in, signing out, creating an account, and staying signed in. Finds or saves information in the database, where the CRM keeps its records.
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";
// Study: Bring in `{ CreateRefreshTokenInput }` from `"./auth.types"` so this file can use it.
import { CreateRefreshTokenInput } from "./auth.types";

// Study: Make `createRefreshToken` available to other files. Its result arrives after its work finishes.
export const createRefreshToken = async (
    // Study: This step receives `data`. `CreateRefreshTokenInput` describes what that information should look like.
    data: CreateRefreshTokenInput
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `prisma.refreshToken.create({ data: { token: data.hashedToken, userId: data.userId, …` back to the code that asked for it.
    return prisma.refreshToken.create({
        // Study: Supply the values to write to the database.
        data: {
            // Study: Set `token` to `data.hashedToken`.
            token: data.hashedToken,
            // Study: Set `userId` to `data.userId`.
            userId: data.userId,
            // Study: Set `expiresAt` to `data.expiresAt`.
            expiresAt: data.expiresAt,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findRefreshTokensByUserId` available to other files. Its result arrives after its work finishes.
export const findRefreshTokensByUserId = async (
    // Study: This step receives `userId`. `string` describes what that information should look like.
    userId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `prisma.refreshToken.findMany({ where: { userId, }, })` back to the code that asked for it.
    return prisma.refreshToken.findMany({
        // Study: Set the conditions that records must meet using userId.
        where: {
            // Study: Carry the value of `userId` into the new group under the same name.
            userId,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `revokeRefreshToken` available to other files. Its result arrives after its work finishes.
export const revokeRefreshToken = async (
    // Study: This step receives `id`. `string` describes what that information should look like.
    id: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `prisma.refreshToken.update({ where: { id, }, data: { revokedAt: new Date(), }, })` back to the code that asked for it.
    return prisma.refreshToken.update({
        // Study: Set the conditions that records must meet using id.
        where: {
            // Study: Carry the value of `id` into the new group under the same name.
            id,
        // Study: End this group of values.
        },
        // Study: Supply the values to write to the database.
        data: {
            // Study: Set `revokedAt` to `new Date()`.
            revokedAt: new Date(),
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};