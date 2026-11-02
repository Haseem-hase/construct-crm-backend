import prisma from "../../lib/prisma";

import {
    CreateLabourInput,
    UpdateLabourInput,
} from "./labour.types";


export const createLabour = async (
    data: CreateLabourInput & {
        organizationId: string;
    }
) => {
    return await prisma.labour.create({
        data: {
            ...data,
        },
    });
};


export const findLabours = async (
    organizationId: string
) => {
    return await prisma.labour.findMany({
        where: {
            organizationId,
        },
        include: {
            profession: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const findAllPlatformLabours = async () => prisma.labour.findMany({
    include: {
        profession: true,
        organization: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
});

export const findPlatformLabourById = async (labourId: string) => prisma.labour.findUnique({
    where: { id: labourId },
    include: {
        profession: true,
        organization: { select: { id: true, name: true } },
    },
});


export const findLabourById = async (
    labourId: string,
    organizationId: string
) => {
    return await prisma.labour.findFirst({
        where: {
            id: labourId,
            organizationId,
        },
        include: {
            profession: true,
        },
    });
};


export const updateLabour = async (
    labourId: string,
    organizationId: string,
    data: UpdateLabourInput
) => {
    const result = await prisma.labour.updateMany({
        where: {
            id: labourId,
            organizationId,
        },
        data: {
            ...data,
        },
    });

    if (result.count === 0) {
        return null;
    }

    return await prisma.labour.findFirst({
        where: { 
            id: labourId,
            organizationId
        },
        include: {
            profession: true,
        },
    });
};


export const findProfessionById = async (
    professionId: string
) => {
    return await prisma.profession.findUnique({
        where: {
            id: professionId,
        },
        select: {
            id: true,
            isActive: true,
        },
    });
};

export const findLabourByPhone = async (
    organizationId: string,
    phone: string
) => {
    return await prisma.labour.findUnique({
        where: {
            organizationId_phone: {
                organizationId,
                phone,
            },
        },
    });
};
