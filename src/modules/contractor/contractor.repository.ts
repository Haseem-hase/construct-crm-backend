// Study: Read and write database records through Prisma for contractor records.
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";

// Study: Import `{ CreateContractorInput, UpdateContractorInput, }` from `"./contractor.types"`.
import {
    // Study: Bring `CreateContractorInput` into scope from the imported module.
    CreateContractorInput,
    // Study: Bring `UpdateContractorInput` into scope from the imported module.
    UpdateContractorInput,
// Study: Close this group and continue the enclosing expression.
} from "./contractor.types";

// Study: Export `createContractor` as an async function that returns a promise.
export const createContractor = async (
    // Study: Accept `data` with type `CreateContractorInput & { organizationId: string; }`.
    data: CreateContractorInput & {
        // Study: Define `organizationId` with type `string`.
        organizationId: string;
    // Study: Close the object type.
    }
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.contractor.create({ data: { ...data, }, })` to the caller.
    return await prisma.contractor.create({
        // Study: Supply the values to write to the database.
        data: {
            // Study: Expand the values from `data` into the surrounding collection.
            ...data,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findContractors` as an async function that returns a promise.
export const findContractors = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.contractor.findMany({ where: { organizationId, }, orderBy: { createdAt…` to the caller.
    return await prisma.contractor.findMany({
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
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findAllPlatformContractors` as an async function that returns a promise.
export const findAllPlatformContractors = async () => prisma.contractor.findMany({
    // Study: Load related database records with the main result.
    include: { organization: { select: { id: true, name: true } } },
    // Study: Set the sort order for the returned records.
    orderBy: { createdAt: "desc" },
// Study: Close the object literal.
});

// Study: Export `findPlatformContractorById` as an async function that returns a promise.
export const findPlatformContractorById = async (contractorId: string) => prisma.contractor.findUnique({
    // Study: Set the conditions that database records must match using id.
    where: { id: contractorId },
    // Study: Load related database records with the main result.
    include: { organization: { select: { id: true, name: true } } },
// Study: Close the object literal.
});

// Study: Export `findContractorById` as an async function that returns a promise.
export const findContractorById = async (
    // Study: Accept `contractorId` with type `string`.
    contractorId: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.contractor.findFirst({ where: { id: contractorId, organizationId, }, })` to the caller.
    return await prisma.contractor.findFirst({
        // Study: Set the conditions that database records must match using id, organizationId.
        where: {
            // Study: Set `id` to `contractorId`.
            id: contractorId,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `updateContractor` as an async function that returns a promise.
export const updateContractor = async (
    // Study: Accept `contractorId` with type `string`.
    contractorId: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `data` with type `UpdateContractorInput`.
    data: UpdateContractorInput
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Update all records matching the filters through `prisma.contractor` and wait for it to finish and store its result in `result`.
    const result = await prisma.contractor.updateMany({
        // Study: Set the conditions that database records must match using id, organizationId.
        where: {
            // Study: Set `id` to `contractorId`.
            id: contractorId,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },
        // Study: Supply the values to write to the database.
        data: {
            // Study: Expand the values from `data` into the surrounding collection.
            ...data,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });

    // Study: Run the following branch when `result.count === 0` is truthy.
    if (result.count === 0) {
        // Study: Return `null` to the caller.
        return null;
    // Study: Close the code block.
    }

    // Study: Return `await prisma.contractor.findFirst({ where: { id: contractorId, organizationId, }, })` to the caller.
    return await prisma.contractor.findFirst({
        // Study: Set the conditions that database records must match using id, organizationId.
        where: {
            // Study: Set `id` to `contractorId`.
            id: contractorId,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findContractorByPhone` as an async function that returns a promise.
export const findContractorByPhone = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `phone` with type `string`.
    phone: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.contractor.findUnique({ where: { organizationId_phone: { organizationI…` to the caller.
    return await prisma.contractor.findUnique({
        // Study: Set the conditions that database records must match using organizationId_phone.
        where: {
            // Study: Start the nested value for `organizationId_phone`.
            organizationId_phone: {
                // Study: Pass the current `organizationId` value under the same property name.
                organizationId,
                // Study: Pass the current `phone` value under the same property name.
                phone,
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findContractorByEmail` as an async function that returns a promise.
export const findContractorByEmail = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `email` with type `string`.
    email: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.contractor.findUnique({ where: { organizationId_email: { organizationI…` to the caller.
    return await prisma.contractor.findUnique({
        // Study: Set the conditions that database records must match using organizationId_email.
        where: {
            // Study: Start the nested value for `organizationId_email`.
            organizationId_email: {
                // Study: Pass the current `organizationId` value under the same property name.
                organizationId,
                // Study: Pass the current `email` value under the same property name.
                email,
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};
