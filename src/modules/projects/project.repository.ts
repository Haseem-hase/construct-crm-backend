// Study: Read and write database records through Prisma for construction projects, their site details, and image galleries.
// Study: Import `{ Prisma }` from `"@prisma/client"`.
import { Prisma } from "@prisma/client";
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";

// Study: Import `{ CreateProjectInput, ProjectImageMutation, UpdateProjectInput }` from `"./project.types"`.
import { CreateProjectInput, ProjectImageMutation, UpdateProjectInput } from "./project.types";
// Study: Import `{ BadRequestError }` from `"../../errors/BadRequestError"`.
import { BadRequestError } from "../../errors/BadRequestError";

// Study: Define `imageDetails` as a reusable function.
const imageDetails = (image: ProjectImageMutation) => ({
    // Study: Set `kind` to `image.kind`.
    kind: image.kind, visitedAt: image.visitedAt, siteStage: image.siteStage,
    // Study: Set `areaSqFt` to `image.areaSqFt`.
    areaSqFt: image.areaSqFt, notes: image.notes,
// Study: Close the object literal.
});

// Study: Build the object `projectRelations` with the entries below.
const projectRelations = {
    // Study: Start the nested value for `projectCustomers`.
    projectCustomers: { include: { customer: true } },
    // Study: Start the nested value for `images`.
    images: { orderBy: { position: "asc" as const } },
// Study: Close the object literal.
};

// Study: Export `createProject` as an async function that returns a promise.
export const createProject = async (
    // Study: Accept `data` with type `CreateProjectInput & { organizationId: string; }`.
    data: CreateProjectInput & {
        // Study: Define `organizationId` with type `string`.
        organizationId: string;
    // Study: Close the object type.
    },
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient,
    // Study: Accept `images` with type `ProjectImageMutation[]` with initial value `[]`.
    images: ProjectImageMutation[] = []
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Return `await db.project.create({ data: { name: data.name, description: data.description, a…` to the caller.
    return await db.project.create({
        // Study: Supply the values to write to the database.
        data: {
            // Study: Set `name` to `data.name`.
            name: data.name,
            // Study: Set `description` to `data.description`.
            description: data.description,
            // Study: Set `areaSqFt` to `data.areaSqFt`.
            areaSqFt: data.areaSqFt,
            // Study: Set `imageUrl` to `data.imageUrl`.
            imageUrl: data.imageUrl,
            // Study: Set `status` to `data.status`.
            status: data.status,
            // Study: Set `country` to `data.country`.
            country: data.country,
            // Study: Set `city` to `data.city`.
            city: data.city,
            // Study: Set `address` to `data.address`.
            address: data.address,
            // Study: Set `latitude` to `data.latitude`.
            latitude: data.latitude,
            // Study: Set `longitude` to `data.longitude`.
            longitude: data.longitude,
            // Study: Set `plannedStartDate` to `data.plannedStartDate`.
            plannedStartDate: data.plannedStartDate,
            // Study: Set `plannedEndDate` to `data.plannedEndDate`.
            plannedEndDate: data.plannedEndDate,
            // Study: Set `actualStartDate` to `data.actualStartDate`.
            actualStartDate: data.actualStartDate,
            // Study: Set `actualEndDate` to `data.actualEndDate`.
            actualEndDate: data.actualEndDate,
            // Study: Set `progress` to `data.progress`.
            progress: data.progress,
            // Study: Set `budget` to `data.budget`.
            budget: data.budget,
            // Study: Start the nested value for `images`.
            images: {
                // Study: Set `create` to `images.map((image, position) => ({ ...imageDetails(image), imageUrl: image.imageUrl…`.
                create: images.map((image, position) => ({
                    // Study: Expand the values from `imageDetails(image)` into the surrounding collection.
                    ...imageDetails(image),
                    // Study: Set `imageUrl` to `image.imageUrl!`.
                    imageUrl: image.imageUrl!,
                    // Study: Set `alt` to `image.alt`.
                    alt: image.alt,
                    // Study: Set `isCover` to `image.isCover`.
                    isCover: image.isCover,
                    // Study: Pass the current `position` value under the same property name.
                    position,
                // Study: Close the object literal.
                })),
            // Study: Close the object literal.
            },

            // Study: Set the organization identifier used for this record or operation using `data.organizationId`.
            organizationId: data.organizationId,
        // Study: Close the object literal.
        },
        // Study: Load related database records with the main result.
        include: { images: { orderBy: { position: "asc" } }, projectCustomers: { include: { customer: true } } },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findProjectsByOrganizationId` as an async function that returns a promise.
export const findProjectsByOrganizationId = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.project.findMany({ where: { organizationId, }, orderBy: { createdAt: "…` to the caller.
    return await prisma.project.findMany({
        // Study: Set the conditions that database records must match using organizationId.
        where: {
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `createdAt` to `"desc"`.
            createdAt: "desc",
        // Study: Close the object literal.
        },
        // Study: Load related database records with the main result.
        include: {
            // Study: Expand the values from `projectRelations` into the surrounding collection.
            ...projectRelations,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findAllPlatformProjects` as an async function that returns a promise.
export const findAllPlatformProjects = async () => prisma.project.findMany({
    // Study: Load related database records with the main result.
    include: {
        // Study: Load `organization` and return its selected fields: id, name.
        organization: { select: { id: true, name: true } },
        // Study: Expand the values from `projectRelations` into the surrounding collection.
        ...projectRelations,
    // Study: Close the object literal.
    },
    // Study: Set the sort order for the returned records.
    orderBy: { createdAt: "desc" },
// Study: Close the object literal.
});

// Study: Export `findPlatformProjectById` as an async function that returns a promise.
export const findPlatformProjectById = async (projectId: string) => prisma.project.findUnique({
    // Study: Set the conditions that database records must match using id.
    where: { id: projectId },
    // Study: Load related database records with the main result.
    include: {
        // Study: Load `organization` and return its selected fields: id, name.
        organization: { select: { id: true, name: true } },
        // Study: Expand the values from `projectRelations` into the surrounding collection.
        ...projectRelations,
    // Study: Close the object literal.
    },
// Study: Close the object literal.
});

// Study: Export `findProjectByIdAndOrganization` as an async function that returns a promise.
export const findProjectByIdAndOrganization = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.project.findFirst({ where: { id: projectId, organizationId, }, include…` to the caller.
    return await prisma.project.findFirst({
        // Study: Set the conditions that database records must match using id, organizationId.
        where: {
            // Study: Set `id` to `projectId`.
            id: projectId,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },
        // Study: Load related database records with the main result.
        include: {
            // Study: Start the nested value for `projectCustomers`.
            projectCustomers: { include: { customer: true } },
            // Study: Start the nested value for `images`.
            images: { orderBy: { position: "asc" } },
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `updateProject` as an async function that returns a promise.
export const updateProject = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `data` with type `UpdateProjectInput`.
    data: UpdateProjectInput,
    // Study: Accept `images` as optional with type `ProjectImageMutation[]`.
    images?: ProjectImageMutation[]
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.$transaction(async (tx) => { let coverImageUrl = data.imageUrl; let cu…` to the caller.
    return await prisma.$transaction(async (tx) => {
        // Study: Set `coverImageUrl` to `data.imageUrl`.
        let coverImageUrl = data.imageUrl;
        // Study: Build the array `currentImages` with the entries below.
        let currentImages: Array<{ id: string; imageUrl: string }> = [];
        // Study: Run the following branch when `images !== undefined` is truthy.
        if (images !== undefined) {
            // Study: Assign `await tx.projectImage.findMany({ where: { projectId }, select: { id: true, imageUrl…` to `currentImages`.
            currentImages = await tx.projectImage.findMany({ where: { projectId }, select: { id: true, imageUrl: true } });
            // Study: Create an instance of `Set` and store the result as `currentIds`.
            const currentIds = new Set(currentImages.map(image => image.id));
            // Study: Run the following branch when `images.some(image => image.id && !currentIds.has(image.id))` is truthy.
            if (images.some(image => image.id && !currentIds.has(image.id))) {
                // Study: Stop this execution path by throwing `new BadRequestError("One or more selected images do not belong to this project.")`.
                throw new BadRequestError("One or more selected images do not belong to this project.");
            // Study: Close the code block.
            }
            // Study: Find the first matching item in `images` and store the result as `cover`.
            const cover = images.find(image => image.isCover);
            // Study: Assign `cover?.id ? currentImages.find(image => image.id === cover.id)?.imageUrl ?? null : …` to `coverImageUrl`.
            coverImageUrl = cover?.id
                // Study: Use this value when the preceding condition is truthy.
                ? currentImages.find(image => image.id === cover.id)?.imageUrl ?? null
                // Study: Use this value when the preceding condition is falsy.
                : cover?.imageUrl ?? null;
        // Study: Close the code block.
        }

        // Study: Update all records matching the filters through `tx.project` and wait for it to finish and store its result in `updateResult`.
        const updateResult = await tx.project.updateMany({
            // Study: Set the conditions that database records must match using id, organizationId.
            where: {
                // Study: Set `id` to `projectId`.
                id: projectId,
                // Study: Pass the current `organizationId` value under the same property name.
                organizationId,
            // Study: Close the object literal.
            },
            // Study: Supply the values to write to the database.
            data: {
                // Study: Set `name` to `data.name`.
                name: data.name,
                // Study: Set `description` to `data.description`.
                description: data.description,
            // Study: Set `areaSqFt` to `data.areaSqFt`.
            areaSqFt: data.areaSqFt,
                // Study: Set `imageUrl` to `coverImageUrl`.
                imageUrl: coverImageUrl,
                // Study: Set `status` to `data.status`.
                status: data.status,
                // Study: Set `country` to `data.country`.
                country: data.country,
                // Study: Set `city` to `data.city`.
                city: data.city,
                // Study: Set `address` to `data.address`.
                address: data.address,
                // Study: Set `latitude` to `data.latitude`.
                latitude: data.latitude,
                // Study: Set `longitude` to `data.longitude`.
                longitude: data.longitude,
                // Study: Set `plannedStartDate` to `data.plannedStartDate`.
                plannedStartDate: data.plannedStartDate,
                // Study: Set `plannedEndDate` to `data.plannedEndDate`.
                plannedEndDate: data.plannedEndDate,
                // Study: Set `actualStartDate` to `data.actualStartDate`.
                actualStartDate: data.actualStartDate,
                // Study: Set `actualEndDate` to `data.actualEndDate`.
                actualEndDate: data.actualEndDate,
                // Study: Set `progress` to `data.progress`.
                progress: data.progress,
                // Study: Set `budget` to `data.budget`.
                budget: data.budget,
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        });

        // Study: Run the following branch when `updateResult.count === 0` is truthy.
        if (updateResult.count === 0) {
            // Study: Return `null` to the caller.
            return null;
        // Study: Close the code block.
        }

        // Study: Run the following branch when `images !== undefined` is truthy.
        if (images !== undefined) {
            // Study: Call `images.flatMap` and store the result as `retainedIds`.
            const retainedIds = images.flatMap(image => image.id ? [image.id] : []);
            // Study: Delete records matching the filters through `tx.projectImage` and wait for it to finish.
            await tx.projectImage.deleteMany({
                // Study: Set the conditions that database records must match using projectId.
                where: { projectId, ...(retainedIds.length ? { id: { notIn: retainedIds } } : {}) },
            // Study: Close the object literal.
            });
            // Study: Iterate over each item from `images.entries()` using `const [position, image]`.
            for (const [position, image] of images.entries()) {
                // Study: Run the following branch when `image.id` is truthy.
                if (image.id) {
                    // Study: Update the uniquely identified record through `tx.projectImage` and wait for it to finish.
                    await tx.projectImage.update({
                        // Study: Set the conditions that database records must match using id.
                        where: { id: image.id },
                        // Study: Supply the values to write to the database.
                        data: { ...imageDetails(image), isCover: image.isCover, position },
                    // Study: Close the object literal.
                    });
                // Study: If the previous condition failed, check `image.imageUrl`.
                } else if (image.imageUrl) {
                    // Study: Insert a new record through `tx.projectImage` and wait for it to finish.
                    await tx.projectImage.create({
                        // Study: Supply the values to write to the database.
                        data: { ...imageDetails(image), projectId, imageUrl: image.imageUrl, alt: image.alt, isCover: image.isCover, position },
                    // Study: Close the object literal.
                    });
                // Study: Close the code block.
                }
            // Study: Close the code block.
            }
        // Study: Close the code block.
        }

        // Study: Return `await tx.project.findFirst({ where: { id: projectId, organizationId, }, include: pr…` to the caller.
        return await tx.project.findFirst({
            // Study: Set the conditions that database records must match using id, organizationId.
            where: {
                // Study: Set `id` to `projectId`.
                id: projectId,
                // Study: Pass the current `organizationId` value under the same property name.
                organizationId,
            // Study: Close the object literal.
            },
            // Study: Load related database records with the main result using `projectRelations`.
            include: projectRelations,
        // Study: Close the object literal.
        });
    // Study: Close the code block.
    });
// Study: Close the code block.
};

// Study: Export `deleteProject` as an async function that returns a promise.
export const deleteProject = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Delete records matching the filters through `prisma.project` and wait for it to finish and store its result in `result`.
    const result = await prisma.project.deleteMany({
        // Study: Set the conditions that database records must match using id, organizationId.
        where: {
            // Study: Set `id` to `projectId`.
            id: projectId,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });

    // Study: Return `result.count > 0` to the caller.
    return result.count > 0;
// Study: Close the code block.
};
