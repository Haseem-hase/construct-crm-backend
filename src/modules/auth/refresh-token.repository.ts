import prisma from "../../lib/prisma";
import { CreateRefreshTokenInput } from "./auth.types";

export const createRefreshToken = async (
    data: CreateRefreshTokenInput
) => {
    return prisma.refreshToken.create({
        data: {
            token: data.hashedToken,
            userId: data.userId,
            expiresAt: data.expiresAt,
        },
    });
};

export const findRefreshTokensByUserId = async (
    userId: string
) => {
    return prisma.refreshToken.findMany({
        where: {
            userId,
        },
    });
};