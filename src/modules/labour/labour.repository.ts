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
