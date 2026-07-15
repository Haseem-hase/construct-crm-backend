import prisma from '../../lib/prisma';
import { CreateUserInput } from './auth.types';

export const findUserByEmail = async (email: string) => {
    return await prisma.user.findUnique({
        where: {
            email,
        },
    });
};

export const findUserByPhone = async (phone: string) => {
    return await prisma.user.findUnique({
        where: {
            phone,
        },
    });
};

export const findRoleByName = async (name: string) => {
    return await prisma.role.findUnique({
        where: {
            name,
        },
    });
};

export const createUser = async (
    data: CreateUserInput
) => {
    return await prisma.user.create({
        data,
    });
};