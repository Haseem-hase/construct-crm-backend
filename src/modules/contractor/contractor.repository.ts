import prisma from "../../lib/prisma";

import {
    CreateContractorInput,
    UpdateContractorInput,
} from "./contractor.types";

export const createContractor = async (
    data: CreateContractorInput & {
        organizationId: string;
    }
) => {
    return await prisma.contractor.create({
        data: {
            ...data,
        },
    });
};

export const findContractors = async (
    organizationId: string
) => {
    return await prisma.contractor.findMany({
        where: {
            organizationId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const findContractorById = async (
    contractorId: string,
    organizationId: string
) => {
    return await prisma.contractor.findFirst({
        where: {
            id: contractorId,
            organizationId,
        },
    });
};

export const updateContractor = async (
    contractorId: string,
    organizationId: string,
    data: UpdateContractorInput
) => {
    const result = await prisma.contractor.updateMany({
        where: {
            id: contractorId,
            organizationId,
        },
        data: {
            ...data,
        },
    });

    if (result.count === 0) {
        return null;
    }

    return await prisma.contractor.findFirst({
        where: {
            id: contractorId,
            organizationId,
        },
    });
};

export const findContractorByPhone = async (
    organizationId: string,
    phone: string
) => {
    return await prisma.contractor.findUnique({
        where: {
            organizationId_phone: {
                organizationId,
                phone,
            },
        },
    });
};

export const findContractorByEmail = async (
    organizationId: string,
    email: string
) => {
    return await prisma.contractor.findUnique({
        where: {
            organizationId_email: {
                organizationId,
                email,
            },
        },
    });
};
