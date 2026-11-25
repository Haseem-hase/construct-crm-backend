// Study: Read and write database records through Prisma for account registration, sign-in, sign-out, and session token refresh.
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";
// Study: Import `{ CreateRefreshTokenInput }` from `"./auth.types"`.
import { CreateRefreshTokenInput } from "./auth.types";

// Study: Export `createRefreshToken` as an async function that returns a promise.
export const createRefreshToken = async (
    // Study: Accept `data` with type `CreateRefreshTokenInput`.
    data: CreateRefreshTokenInput
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `prisma.refreshToken.create({ data: { token: data.hashedToken, userId: data.userId, …` to the caller.
    return prisma.refreshToken.create({
        // Study: Supply the values to write to the database.
        data: {
            // Study: Set `token` to `data.hashedToken`.
            token: data.hashedToken,
            // Study: Set `userId` to `data.userId`.
            userId: data.userId,
            // Study: Set `expiresAt` to `data.expiresAt`.
            expiresAt: data.expiresAt,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findRefreshTokensByUserId` as an async function that returns a promise.
export const findRefreshTokensByUserId = async (
    // Study: Accept `userId` with type `string`.
    userId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `prisma.refreshToken.findMany({ where: { userId, }, })` to the caller.
    return prisma.refreshToken.findMany({
        // Study: Set the conditions that database records must match using userId.
        where: {
            // Study: Pass the current `userId` value under the same property name.
            userId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `revokeRefreshToken` as an async function that returns a promise.
export const revokeRefreshToken = async (
    // Study: Accept `id` with type `string`.
    id: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `prisma.refreshToken.update({ where: { id, }, data: { revokedAt: new Date(), }, })` to the caller.
    return prisma.refreshToken.update({
        // Study: Set the conditions that database records must match using id.
        where: {
            // Study: Pass the current `id` value under the same property name.
            id,
        // Study: Close the object literal.
        },
        // Study: Supply the values to write to the database.
        data: {
            // Study: Set `revokedAt` to `new Date()`.
            revokedAt: new Date(),
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};