import prisma from "../../lib/prisma";

import { CreateProjectInput } from "./project.types";

export const createProject = async (
    data: CreateProjectInput & {
        organizationId: string;
    }
) => {
    return await prisma.project.create({
        data: {
            projectCode: data.projectCode,
            name: data.name,
            description: data.description,

            organizationId: data.organizationId,
            customerId: data.customerId,

            address: data.address,
            city: data.city,
            latitude: data.latitude,
            longitude: data.longitude,

            startDate: data.startDate,
            scheduledEndDate: data.scheduledEndDate,

            budget: data.budget,
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

export const findProjectById = async (
    projectId: string
) => {
    return await prisma.project.findUnique({
        where: {
            id: projectId,
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
