import prisma from "../../lib/prisma";
import { Prisma, ProjectCustomerRelationshipType } from "@prisma/client";
import { UpdateProjectCustomerInput } from "./project-customer.types";

export const createProjectCustomer = async (
    data: {
        projectId: string;
        customerId: string;
        relationshipType: ProjectCustomerRelationshipType;
        isPrimary?: boolean;
    },
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    return await db.projectCustomer.create({
        data,
    });
};

export const findProjectCustomersByProjectId = async (
    projectId: string,
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    return await db.projectCustomer.findMany({
        where: {
            projectId,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
};

export const findProjectCustomerByProjectAndCustomer = async (
    projectId: string,
    customerId: string,
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    return await db.projectCustomer.findFirst({
        where: {
            projectId,
            customerId,
        },
    });
};

export const findProjectCustomerById = async (
    projectId: string,
    projectCustomerId: string,
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    return await db.projectCustomer.findFirst({
        where: {
            id: projectCustomerId,
            projectId,
        },
    });
};

export const findProjectCustomerByRelationship = async (
    projectId: string,
    customerId: string,
    relationshipType: ProjectCustomerRelationshipType,
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    return await db.projectCustomer.findFirst({
        where: {
            projectId,
            customerId,
            relationshipType,
        },
    });
};

export const updateProjectCustomer = async (
    projectId: string,
    projectCustomerId: string,
    data: UpdateProjectCustomerInput,
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    
    const updateData: Prisma.ProjectCustomerUpdateManyMutationInput = {};

    if (data.relationshipType !== undefined) {
        updateData.relationshipType = data.relationshipType;
    }

    if (data.isPrimary !== undefined) {
        updateData.isPrimary = data.isPrimary;
    }

    const result = await db.projectCustomer.updateMany({
        where: {
            id: projectCustomerId,
            projectId,
        },
        data: updateData,
    });

    if (result.count === 0) {
        return null;
    }

    return await db.projectCustomer.findFirst({
        where: {
            id: projectCustomerId,
            projectId,
        },
    });
};

export const deleteProjectCustomer = async (
    projectId: string,
    projectCustomerId: string,
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    const result = await db.projectCustomer.deleteMany({
        where: {
            id: projectCustomerId,
            projectId,
        },
    });

    return result.count > 0;
};

export const clearPrimaryProjectCustomer = async (
    projectId: string,
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    return await db.projectCustomer.updateMany({
        where: {
            projectId,
            isPrimary: true,
        },
        data: {
            isPrimary: false,
        },
    });
};
