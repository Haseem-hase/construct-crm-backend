import { Prisma } from "@prisma/client";
import prisma from "../../lib/prisma";

import { CreateProjectInput, ProjectImageMutation, UpdateProjectInput } from "./project.types";
import { BadRequestError } from "../../errors/BadRequestError";

const imageDetails = (image: ProjectImageMutation) => ({
    kind: image.kind, visitedAt: image.visitedAt, siteStage: image.siteStage,
    areaSqFt: image.areaSqFt, notes: image.notes,
});

const projectRelations = {
    projectCustomers: { include: { customer: true } },
    images: { orderBy: { position: "asc" as const } },
};

export const createProject = async (
    data: CreateProjectInput & {
        organizationId: string;
    },
    tx?: Prisma.TransactionClient,
    images: ProjectImageMutation[] = []
) => {
    const db = tx || prisma;
    return await db.project.create({
        data: {
            name: data.name,
            description: data.description,
            areaSqFt: data.areaSqFt,
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
            images: {
                create: images.map((image, position) => ({
                    ...imageDetails(image),
                    imageUrl: image.imageUrl!,
                    alt: image.alt,
                    isCover: image.isCover,
                    position,
                })),
            },

            organizationId: data.organizationId,
        },
        include: { images: { orderBy: { position: "asc" } }, projectCustomers: { include: { customer: true } } },
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
        include: {
            ...projectRelations,
        },
    });
};

export const findAllPlatformProjects = async () => prisma.project.findMany({
    include: {
        organization: { select: { id: true, name: true } },
        ...projectRelations,
    },
    orderBy: { createdAt: "desc" },
});

export const findPlatformProjectById = async (projectId: string) => prisma.project.findUnique({
    where: { id: projectId },
    include: {
        organization: { select: { id: true, name: true } },
        ...projectRelations,
    },
});

export const findProjectByIdAndOrganization = async (
    projectId: string,
    organizationId: string
) => {
    return await prisma.project.findFirst({
        where: {
            id: projectId,
            organizationId,
        },
        include: {
            projectCustomers: { include: { customer: true } },
            images: { orderBy: { position: "asc" } },
        },
    });
};

export const updateProject = async (
    projectId: string,
    organizationId: string,
    data: UpdateProjectInput,
    images?: ProjectImageMutation[]
) => {
    return await prisma.$transaction(async (tx) => {
        let coverImageUrl = data.imageUrl;
        let currentImages: Array<{ id: string; imageUrl: string }> = [];
        if (images !== undefined) {
            currentImages = await tx.projectImage.findMany({ where: { projectId }, select: { id: true, imageUrl: true } });
            const currentIds = new Set(currentImages.map(image => image.id));
            if (images.some(image => image.id && !currentIds.has(image.id))) {
                throw new BadRequestError("One or more selected images do not belong to this project.");
            }
            const cover = images.find(image => image.isCover);
            coverImageUrl = cover?.id
                ? currentImages.find(image => image.id === cover.id)?.imageUrl ?? null
                : cover?.imageUrl ?? null;
        }

        const updateResult = await tx.project.updateMany({
            where: {
                id: projectId,
                organizationId,
            },
            data: {
                name: data.name,
                description: data.description,
            areaSqFt: data.areaSqFt,
                imageUrl: coverImageUrl,
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

        if (images !== undefined) {
            const retainedIds = images.flatMap(image => image.id ? [image.id] : []);
            await tx.projectImage.deleteMany({
                where: { projectId, ...(retainedIds.length ? { id: { notIn: retainedIds } } : {}) },
            });
            for (const [position, image] of images.entries()) {
                if (image.id) {
                    await tx.projectImage.update({
                        where: { id: image.id },
                        data: { ...imageDetails(image), isCover: image.isCover, position },
                    });
                } else if (image.imageUrl) {
                    await tx.projectImage.create({
                        data: { ...imageDetails(image), projectId, imageUrl: image.imageUrl, alt: image.alt, isCover: image.isCover, position },
                    });
                }
            }
        }

        return await tx.project.findFirst({
            where: {
                id: projectId,
                organizationId,
            },
            include: projectRelations,
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
