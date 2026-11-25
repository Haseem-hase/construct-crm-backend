// Study: This file is about the details the CRM keeps about contractors. Finds or saves information in the database, where the CRM keeps its records.
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";

// Study: Bring in `{ CreateContractorInput, UpdateContractorInput, }` from `"./contractor.types"` so this file can use it.
import {
    // Study: Make `CreateContractorInput` from the other file available here.
    CreateContractorInput,
    // Study: Make `UpdateContractorInput` from the other file available here.
    UpdateContractorInput,
// Study: Finish this group and continue the surrounding step.
} from "./contractor.types";

// Study: Make `createContractor` available to other files. Its result arrives after its work finishes.
export const createContractor = async (
    // Study: This step receives `data`. `CreateContractorInput & { organizationId: string; }` describes what that information should look like.
    data: CreateContractorInput & {
        // Study: Define `organizationId` with type `string`.
        organizationId: string;
    // Study: Close the object type.
    }
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.contractor.create({ data: { ...data, }, })` back to the code that asked for it.
    return await prisma.contractor.create({
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

// Study: Make `findContractors` available to other files. Its result arrives after its work finishes.
export const findContractors = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.contractor.findMany({ where: { organizationId, }, orderBy: { createdAt…` back to the code that asked for it.
    return await prisma.contractor.findMany({
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
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findAllPlatformContractors` available to other files. Its result arrives after its work finishes.
export const findAllPlatformContractors = async () => prisma.contractor.findMany({
    // Study: Ask for linked information along with the main record.
    include: { organization: { select: { id: true, name: true } } },
    // Study: Set the sort order for the returned records.
    orderBy: { createdAt: "desc" },
// Study: End this group of values.
});

// Study: Make `findPlatformContractorById` available to other files. Its result arrives after its work finishes.
export const findPlatformContractorById = async (contractorId: string) => prisma.contractor.findUnique({
    // Study: Set the conditions that records must meet using id.
    where: { id: contractorId },
    // Study: Ask for linked information along with the main record.
    include: { organization: { select: { id: true, name: true } } },
// Study: End this group of values.
});

// Study: Make `findContractorById` available to other files. Its result arrives after its work finishes.
export const findContractorById = async (
    // Study: This step receives `contractorId`. `string` describes what that information should look like.
    contractorId: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.contractor.findFirst({ where: { id: contractorId, organizationId, }, })` back to the code that asked for it.
    return await prisma.contractor.findFirst({
        // Study: Set the conditions that records must meet using id, organizationId.
        where: {
            // Study: Set `id` to `contractorId`.
            id: contractorId,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `updateContractor` available to other files. Its result arrives after its work finishes.
export const updateContractor = async (
    // Study: This step receives `contractorId`. `string` describes what that information should look like.
    contractorId: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `data`. `UpdateContractorInput` describes what that information should look like.
    data: UpdateContractorInput
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Update all records matching the filters through `prisma.contractor` and wait for it to finish and store its result in `result`.
    const result = await prisma.contractor.updateMany({
        // Study: Set the conditions that records must meet using id, organizationId.
        where: {
            // Study: Set `id` to `contractorId`.
            id: contractorId,
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

    // Study: Give `await prisma.contractor.findFirst({ where: { id: contractorId, organizationId, }, })` back to the code that asked for it.
    return await prisma.contractor.findFirst({
        // Study: Set the conditions that records must meet using id, organizationId.
        where: {
            // Study: Set `id` to `contractorId`.
            id: contractorId,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findContractorByPhone` available to other files. Its result arrives after its work finishes.
export const findContractorByPhone = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `phone`. `string` describes what that information should look like.
    phone: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.contractor.findUnique({ where: { organizationId_phone: { organizationI…` back to the code that asked for it.
    return await prisma.contractor.findUnique({
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

// Study: Make `findContractorByEmail` available to other files. Its result arrives after its work finishes.
export const findContractorByEmail = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `email`. `string` describes what that information should look like.
    email: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.contractor.findUnique({ where: { organizationId_email: { organizationI…` back to the code that asked for it.
    return await prisma.contractor.findUnique({
        // Study: Set the conditions that records must meet using organizationId_email.
        where: {
            // Study: Start the nested value for `organizationId_email`.
            organizationId_email: {
                // Study: Carry the value of `organizationId` into the new group under the same name.
                organizationId,
                // Study: Carry the value of `email` into the new group under the same name.
                email,
            // Study: End this group of values.
            },
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};
