import prisma from '../../lib/prisma';

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