// Study: This file is about workers and the kinds of work they do. Finds or saves information in the database, where the CRM keeps its records.
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";

// Study: Bring in `{ CreateLabourInput, UpdateLabourInput, }` from `"./labour.types"` so this file can use it.
import {
    // Study: Make `CreateLabourInput` from the other file available here.
    CreateLabourInput,
    // Study: Make `UpdateLabourInput` from the other file available here.
    UpdateLabourInput,
// Study: Finish this group and continue the surrounding step.
} from "./labour.types";


// Study: Make `createLabour` available to other files. Its result arrives after its work finishes.
export const createLabour = async (
    // Study: This step receives `data`. `CreateLabourInput & { organizationId: string; }` describes what that information should look like.
    data: CreateLabourInput & {
        // Study: Define `organizationId` with type `string`.
        organizationId: string;
    // Study: Close the object type.
    }
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.labour.create({ data: { ...data, }, })` back to the code that asked for it.
    return await prisma.labour.create({
        // Study: Supply the values to write to the database.
        data: {
            // Study: Expand the values from `data` into the surrounding collection.
            ...data,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};


// Study: Make `findLabours` available to other files. Its result arrives after its work finishes.
export const findLabours = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.labour.findMany({ where: { organizationId, }, include: { profession: t…` back to the code that asked for it.
    return await prisma.labour.findMany({
        // Study: Set the conditions that records must meet using organizationId.
        where: {
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },
        // Study: Ask for linked information along with the main record.
        include: {
            // Study: Set `profession` to `true`.
            profession: true,
        // Study: End this group of values.
        },
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `createdAt` to `"desc"`.
            createdAt: "desc",
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findAllPlatformLabours` available to other files. Its result arrives after its work finishes.
export const findAllPlatformLabours = async () => prisma.labour.findMany({
    // Study: Ask for linked information along with the main record.
    include: {
        // Study: Set `profession` to `true`.
        profession: true,
        // Study: Load `organization` and return its selected fields: id, name.
        organization: { select: { id: true, name: true } },
    // Study: End this group of values.
    },
    // Study: Set the sort order for the returned records.
    orderBy: { createdAt: "desc" },
// Study: End this group of values.
});

// Study: Make `findPlatformLabourById` available to other files. Its result arrives after its work finishes.
export const findPlatformLabourById = async (labourId: string) => prisma.labour.findUnique({
    // Study: Set the conditions that records must meet using id.
    where: { id: labourId },
    // Study: Ask for linked information along with the main record.
    include: {
        // Study: Set `profession` to `true`.
        profession: true,
        // Study: Load `organization` and return its selected fields: id, name.
        organization: { select: { id: true, name: true } },
    // Study: End this group of values.
    },
// Study: End this group of values.
});


// Study: Make `findLabourById` available to other files. Its result arrives after its work finishes.
export const findLabourById = async (
    // Study: This step receives `labourId`. `string` describes what that information should look like.
    labourId: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.labour.findFirst({ where: { id: labourId, organizationId, }, include: …` back to the code that asked for it.
    return await prisma.labour.findFirst({
        // Study: Set the conditions that records must meet using id, organizationId.
        where: {
            // Study: Set `id` to `labourId`.
            id: labourId,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },
        // Study: Ask for linked information along with the main record.
        include: {
            // Study: Set `profession` to `true`.
            profession: true,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};


// Study: Make `updateLabour` available to other files. Its result arrives after its work finishes.
export const updateLabour = async (
    // Study: This step receives `labourId`. `string` describes what that information should look like.
    labourId: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `data`. `UpdateLabourInput` describes what that information should look like.
    data: UpdateLabourInput
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Update all records matching the filters through `prisma.labour` and wait for it to finish and store its result in `result`.
    const result = await prisma.labour.updateMany({
        // Study: Set the conditions that records must meet using id, organizationId.
        where: {
            // Study: Set `id` to `labourId`.
            id: labourId,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },
        // Study: Supply the values to write to the database.
        data: {
            // Study: Expand the values from `data` into the surrounding collection.
            ...data,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });

    // Study: Do the next step if this check passes: `result.count === 0`.
    if (result.count === 0) {
        // Study: Give `null` back to the code that asked for it.
        return null;
    // Study: End this group of steps.
    }

    // Study: Give `await prisma.labour.findFirst({ where: { id: labourId, organizationId }, include: {…` back to the code that asked for it.
    return await prisma.labour.findFirst({
        // Study: Set the conditions that records must meet using id, organizationId.
        where: { 
            // Study: Set `id` to `labourId`.
            id: labourId,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId
        // Study: End this group of values.
        },
        // Study: Ask for linked information along with the main record.
        include: {
            // Study: Set `profession` to `true`.
            profession: true,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};


// Study: Make `findProfessionById` available to other files. Its result arrives after its work finishes.
export const findProfessionById = async (
    // Study: This step receives `professionId`. `string` describes what that information should look like.
    professionId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.profession.findUnique({ where: { id: professionId, }, select: { id: tr…` back to the code that asked for it.
    return await prisma.profession.findUnique({
        // Study: Set the conditions that records must meet using id.
        where: {
            // Study: Set `id` to `professionId`.
            id: professionId,
        // Study: End this group of values.
        },
        // Study: Choose which details the database gives back.
        select: {
            // Study: Set `id` to `true`.
            id: true,
            // Study: Set `isActive` to `true`.
            isActive: true,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findLabourByPhone` available to other files. Its result arrives after its work finishes.
export const findLabourByPhone = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `phone`. `string` describes what that information should look like.
    phone: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.labour.findUnique({ where: { organizationId_phone: { organizationId, p…` back to the code that asked for it.
    return await prisma.labour.findUnique({
        // Study: Set the conditions that records must meet using organizationId_phone.
        where: {
            // Study: Start the nested value for `organizationId_phone`.
            organizationId_phone: {
                // Study: Carry the value of `organizationId` into the new group under the same name.
                organizationId,
                // Study: Carry the value of `phone` into the new group under the same name.
                phone,
            // Study: End this group of values.
            },
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};
