import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";

import { CreateProjectInput, UpdateProjectInput } from "./project.types";

export const createProject = async (
    data: CreateProjectInput & {
        organizationId: string;
    },
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    return await db.project.create({
        data: {
            name: data.name,
            description: data.description,
            imageUrl: data.imageUrl,
            status: data.status,
            country: data.country,
            city: data.city,
            address: data.address,
            latitude: data.latitude,
            longitude: data.longitude,
            plannedStartDate: data.plannedStartDate,
            plannedEndDate: data.plannedEndDate,
            actualStartDate: data.actualStartDate,
            actualEndDate: data.actualEndDate,
            progress: data.progress,
            budget: data.budget,

            organizationId: data.organizationId,
        },
    });
};

export const findProjectsByOrganizationId = async (
    organizationId: string
) => {
    return await prisma.project.findMany({
        where: {
            organizationId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const findProjectByIdAndOrganization = async (
    projectId: string,
    organizationId: string
) => {
    return await prisma.project.findFirst({
        where: {
            id: projectId,
            organizationId,
        },
    });
};

export const updateProject = async (
    projectId: string,
    organizationId: string,
    data: UpdateProjectInput
) => {
    return await prisma.$transaction(async (tx) => {
        const updateResult = await tx.project.updateMany({
            where: {
                id: projectId,
                organizationId,
            },
            data: {
                name: data.name,
                description: data.description,
                imageUrl: data.imageUrl,
                status: data.status,
                country: data.country,
                city: data.city,
                address: data.address,
                latitude: data.latitude,
                longitude: data.longitude,
                plannedStartDate: data.plannedStartDate,
                plannedEndDate: data.plannedEndDate,
                actualStartDate: data.actualStartDate,
                actualEndDate: data.actualEndDate,
                progress: data.progress,
                budget: data.budget,
            },
        });

        if (updateResult.count === 0) {
            return null;
        }

        return await tx.project.findFirst({
            where: {
                id: projectId,
                organizationId,
            },
        });
    });
};

export const deleteProject = async (
    projectId: string,
    organizationId: string
) => {
    const result = await prisma.project.deleteMany({
        where: {
            id: projectId,
            organizationId,
        },
    });

    return result.count > 0;
};
