// Study: This file is about construction jobs, their site details, and their photos. Finds or saves information in the database, where the CRM keeps its records.
// Study: Bring in `{ Prisma }` from `"@prisma/client"` so this file can use it.
import { Prisma } from "@prisma/client";
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";

// Study: Bring in `{ CreateProjectInput, ProjectImageMutation, UpdateProjectInput }` from `"./project.types"` so this file can use it.
import { CreateProjectInput, ProjectImageMutation, UpdateProjectInput } from "./project.types";
// Study: Bring in `{ BadRequestError }` from `"../../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../../errors/BadRequestError";

// Study: Set up a reusable step named `imageDetails`.
const imageDetails = (image: ProjectImageMutation) => ({
    // Study: Set `kind` to `image.kind`.
    kind: image.kind, visitedAt: image.visitedAt, siteStage: image.siteStage,
    // Study: Set `areaSqFt` to `image.areaSqFt`.
    areaSqFt: image.areaSqFt, notes: image.notes,
// Study: End this group of values.
});

// Study: Build the object `projectRelations` with the entries below.
const projectRelations = {
    // Study: Start the nested value for `projectCustomers`.
    projectCustomers: { include: { customer: true } },
    // Study: Start the nested value for `images`.
    images: { orderBy: { position: "asc" as const } },
// Study: End this group of values.
};

// Study: Make `createProject` available to other files. Its result arrives after its work finishes.
export const createProject = async (
    // Study: This step receives `data`. `CreateProjectInput & { organizationId: string; }` describes what that information should look like.
    data: CreateProjectInput & {
        // Study: Define `organizationId` with type `string`.
        organizationId: string;
    // Study: Close the object type.
    },
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient,
    // Study: This step receives `images`. `ProjectImageMutation[]` with initial value `[]` describes what that information should look like.
    images: ProjectImageMutation[] = []
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Give `await db.project.create({ data: { name: data.name, description: data.description, a…` back to the code that asked for it.
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
                    // Study: Carry the value of `position` into the new group under the same name.
                    position,
                // Study: End this group of values.
                })),
            // Study: End this group of values.
            },

            // Study: Set the organization identifier used for this record or operation using `data.organizationId`.
            organizationId: data.organizationId,
        // Study: End this group of values.
        },
        // Study: Ask for linked information along with the main record.
        include: { images: { orderBy: { position: "asc" } }, projectCustomers: { include: { customer: true } } },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findProjectsByOrganizationId` available to other files. Its result arrives after its work finishes.
export const findProjectsByOrganizationId = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.project.findMany({ where: { organizationId, }, orderBy: { createdAt: "…` back to the code that asked for it.
    return await prisma.project.findMany({
        // Study: Set the conditions that records must meet using organizationId.
        where: {
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `createdAt` to `"desc"`.
            createdAt: "desc",
        // Study: End this group of values.
        },
        // Study: Ask for linked information along with the main record.
        include: {
            // Study: Expand the values from `projectRelations` into the surrounding collection.
            ...projectRelations,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findAllPlatformProjects` available to other files. Its result arrives after its work finishes.
export const findAllPlatformProjects = async () => prisma.project.findMany({
    // Study: Ask for linked information along with the main record.
    include: {
        // Study: Load `organization` and return its selected fields: id, name.
        organization: { select: { id: true, name: true } },
        // Study: Expand the values from `projectRelations` into the surrounding collection.
        ...projectRelations,
    // Study: End this group of values.
    },
    // Study: Set the sort order for the returned records.
    orderBy: { createdAt: "desc" },
// Study: End this group of values.
});

// Study: Make `findPlatformProjectById` available to other files. Its result arrives after its work finishes.
export const findPlatformProjectById = async (projectId: string) => prisma.project.findUnique({
    // Study: Set the conditions that records must meet using id.
    where: { id: projectId },
    // Study: Ask for linked information along with the main record.
    include: {
        // Study: Load `organization` and return its selected fields: id, name.
        organization: { select: { id: true, name: true } },
        // Study: Expand the values from `projectRelations` into the surrounding collection.
        ...projectRelations,
    // Study: End this group of values.
    },
// Study: End this group of values.
});

// Study: Make `findProjectByIdAndOrganization` available to other files. Its result arrives after its work finishes.
export const findProjectByIdAndOrganization = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.project.findFirst({ where: { id: projectId, organizationId, }, include…` back to the code that asked for it.
    return await prisma.project.findFirst({
        // Study: Set the conditions that records must meet using id, organizationId.
        where: {
            // Study: Set `id` to `projectId`.
            id: projectId,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },
        // Study: Ask for linked information along with the main record.
        include: {
            // Study: Start the nested value for `projectCustomers`.
            projectCustomers: { include: { customer: true } },
            // Study: Start the nested value for `images`.
            images: { orderBy: { position: "asc" } },
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `updateProject` available to other files. Its result arrives after its work finishes.
export const updateProject = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `data`. `UpdateProjectInput` describes what that information should look like.
    data: UpdateProjectInput,
    // Study: This step receives `images` as optional. `ProjectImageMutation[]` describes what that information should look like.
    images?: ProjectImageMutation[]
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.$transaction(async (tx) => { let coverImageUrl = data.imageUrl; let cu…` back to the code that asked for it.
    return await prisma.$transaction(async (tx) => {
        // Study: Set `coverImageUrl` to `data.imageUrl`.
        let coverImageUrl = data.imageUrl;
        // Study: Build the array `currentImages` with the entries below.
        let currentImages: Array<{ id: string; imageUrl: string }> = [];
        // Study: Do the next step if this check passes: `images !== undefined`.
        if (images !== undefined) {
            // Study: Assign `await tx.projectImage.findMany({ where: { projectId }, select: { id: true, imageUrl…` to `currentImages`.
            currentImages = await tx.projectImage.findMany({ where: { projectId }, select: { id: true, imageUrl: true } });
            // Study: Create an instance of `Set` and store the result as `currentIds`.
            const currentIds = new Set(currentImages.map(image => image.id));
            // Study: Do the next step if this check passes: `images.some(image => image.id && !currentIds.has(image.id))`.
            if (images.some(image => image.id && !currentIds.has(image.id))) {
                // Study: Stop here and report this problem: "One or more selected images do not belong to this project."
                throw new BadRequestError("One or more selected images do not belong to this project.");
            // Study: End this group of steps.
            }
            // Study: Find the first matching item in `images` and store the result as `cover`.
            const cover = images.find(image => image.isCover);
            // Study: Assign `cover?.id ? currentImages.find(image => image.id === cover.id)?.imageUrl ?? null : …` to `coverImageUrl`.
            coverImageUrl = cover?.id
                // Study: Use this value if the check above passes.
                ? currentImages.find(image => image.id === cover.id)?.imageUrl ?? null
                // Study: Use this value if the check above fails.
                : cover?.imageUrl ?? null;
        // Study: End this group of steps.
        }

        // Study: Update all records matching the filters through `tx.project` and wait for it to finish and store its result in `updateResult`.
        const updateResult = await tx.project.updateMany({
            // Study: Set the conditions that records must meet using id, organizationId.
            where: {
                // Study: Set `id` to `projectId`.
                id: projectId,
                // Study: Carry the value of `organizationId` into the new group under the same name.
                organizationId,
            // Study: End this group of values.
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
            // Study: End this group of values.
            },
        // Study: End this group of values.
        });

        // Study: Do the next step if this check passes: `updateResult.count === 0`.
        if (updateResult.count === 0) {
            // Study: Give `null` back to the code that asked for it.
            return null;
        // Study: End this group of steps.
        }

        // Study: Do the next step if this check passes: `images !== undefined`.
        if (images !== undefined) {
            // Study: Call `images.flatMap` and store the result as `retainedIds`.
            const retainedIds = images.flatMap(image => image.id ? [image.id] : []);
            // Study: Delete records matching the filters through `tx.projectImage` and wait for it to finish.
            await tx.projectImage.deleteMany({
                // Study: Set the conditions that records must meet using projectId.
                where: { projectId, ...(retainedIds.length ? { id: { notIn: retainedIds } } : {}) },
            // Study: End this group of values.
            });
            // Study: Iterate over each item from `images.entries()` using `const [position, image]`.
            for (const [position, image] of images.entries()) {
                // Study: Do the next step if this check passes: `image.id`.
                if (image.id) {
                    // Study: Update the uniquely identified record through `tx.projectImage` and wait for it to finish.
                    await tx.projectImage.update({
                        // Study: Set the conditions that records must meet using id.
                        where: { id: image.id },
                        // Study: Supply the values to write to the database.
                        data: { ...imageDetails(image), isCover: image.isCover, position },
                    // Study: End this group of values.
                    });
                // Study: If the previous condition failed, check `image.imageUrl`.
                } else if (image.imageUrl) {
                    // Study: Insert a new record through `tx.projectImage` and wait for it to finish.
                    await tx.projectImage.create({
                        // Study: Supply the values to write to the database.
                        data: { ...imageDetails(image), projectId, imageUrl: image.imageUrl, alt: image.alt, isCover: image.isCover, position },
                    // Study: End this group of values.
                    });
                // Study: End this group of steps.
                }
            // Study: End this group of steps.
            }
        // Study: End this group of steps.
        }

        // Study: Give `await tx.project.findFirst({ where: { id: projectId, organizationId, }, include: pr…` back to the code that asked for it.
        return await tx.project.findFirst({
            // Study: Set the conditions that records must meet using id, organizationId.
            where: {
                // Study: Set `id` to `projectId`.
                id: projectId,
                // Study: Carry the value of `organizationId` into the new group under the same name.
                organizationId,
            // Study: End this group of values.
            },
            // Study: Ask for linked information along with the main record using `projectRelations`.
            include: projectRelations,
        // Study: End this group of values.
        });
    // Study: End this group of steps.
    });
// Study: End this group of steps.
};

// Study: Make `deleteProject` available to other files. Its result arrives after its work finishes.
export const deleteProject = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Delete records matching the filters through `prisma.project` and wait for it to finish and store its result in `result`.
    const result = await prisma.project.deleteMany({
        // Study: Set the conditions that records must meet using id, organizationId.
        where: {
            // Study: Set `id` to `projectId`.
            id: projectId,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });

    // Study: Give `result.count > 0` back to the code that asked for it.
    return result.count > 0;
// Study: End this group of steps.
};
