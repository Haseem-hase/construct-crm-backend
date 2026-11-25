// Study: Read and write database records through Prisma for worker records and their professions.
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";

// Study: Import `{ CreateLabourInput, UpdateLabourInput, }` from `"./labour.types"`.
import {
    // Study: Bring `CreateLabourInput` into scope from the imported module.
    CreateLabourInput,
    // Study: Bring `UpdateLabourInput` into scope from the imported module.
    UpdateLabourInput,
// Study: Close this group and continue the enclosing expression.
} from "./labour.types";


// Study: Export `createLabour` as an async function that returns a promise.
export const createLabour = async (
    // Study: Accept `data` with type `CreateLabourInput & { organizationId: string; }`.
    data: CreateLabourInput & {
        // Study: Define `organizationId` with type `string`.
        organizationId: string;
    // Study: Close the object type.
    }
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.labour.create({ data: { ...data, }, })` to the caller.
    return await prisma.labour.create({
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


// Study: Export `findLabours` as an async function that returns a promise.
export const findLabours = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.labour.findMany({ where: { organizationId, }, include: { profession: t…` to the caller.
    return await prisma.labour.findMany({
        // Study: Set the conditions that database records must match using organizationId.
        where: {
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },
        // Study: Load related database records with the main result.
        include: {
            // Study: Set `profession` to `true`.
            profession: true,
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

// Study: Export `findAllPlatformLabours` as an async function that returns a promise.
export const findAllPlatformLabours = async () => prisma.labour.findMany({
    // Study: Load related database records with the main result.
    include: {
        // Study: Set `profession` to `true`.
        profession: true,
        // Study: Load `organization` and return its selected fields: id, name.
        organization: { select: { id: true, name: true } },
    // Study: Close the object literal.
    },
    // Study: Set the sort order for the returned records.
    orderBy: { createdAt: "desc" },
// Study: Close the object literal.
});

// Study: Export `findPlatformLabourById` as an async function that returns a promise.
export const findPlatformLabourById = async (labourId: string) => prisma.labour.findUnique({
    // Study: Set the conditions that database records must match using id.
    where: { id: labourId },
    // Study: Load related database records with the main result.
    include: {
        // Study: Set `profession` to `true`.
        profession: true,
        // Study: Load `organization` and return its selected fields: id, name.
        organization: { select: { id: true, name: true } },
    // Study: Close the object literal.
    },
// Study: Close the object literal.
});


// Study: Export `findLabourById` as an async function that returns a promise.
export const findLabourById = async (
    // Study: Accept `labourId` with type `string`.
    labourId: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.labour.findFirst({ where: { id: labourId, organizationId, }, include: …` to the caller.
    return await prisma.labour.findFirst({
        // Study: Set the conditions that database records must match using id, organizationId.
        where: {
            // Study: Set `id` to `labourId`.
            id: labourId,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },
        // Study: Load related database records with the main result.
        include: {
            // Study: Set `profession` to `true`.
            profession: true,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};


// Study: Export `updateLabour` as an async function that returns a promise.
export const updateLabour = async (
    // Study: Accept `labourId` with type `string`.
    labourId: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `data` with type `UpdateLabourInput`.
    data: UpdateLabourInput
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Update all records matching the filters through `prisma.labour` and wait for it to finish and store its result in `result`.
    const result = await prisma.labour.updateMany({
        // Study: Set the conditions that database records must match using id, organizationId.
        where: {
            // Study: Set `id` to `labourId`.
            id: labourId,
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

    // Study: Return `await prisma.labour.findFirst({ where: { id: labourId, organizationId }, include: {…` to the caller.
    return await prisma.labour.findFirst({
        // Study: Set the conditions that database records must match using id, organizationId.
        where: { 
            // Study: Set `id` to `labourId`.
            id: labourId,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId
        // Study: Close the object literal.
        },
        // Study: Load related database records with the main result.
        include: {
            // Study: Set `profession` to `true`.
            profession: true,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};


// Study: Export `findProfessionById` as an async function that returns a promise.
export const findProfessionById = async (
    // Study: Accept `professionId` with type `string`.
    professionId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.profession.findUnique({ where: { id: professionId, }, select: { id: tr…` to the caller.
    return await prisma.profession.findUnique({
        // Study: Set the conditions that database records must match using id.
        where: {
            // Study: Set `id` to `professionId`.
            id: professionId,
        // Study: Close the object literal.
        },
        // Study: Choose which fields Prisma returns.
        select: {
            // Study: Set `id` to `true`.
            id: true,
            // Study: Set `isActive` to `true`.
            isActive: true,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findLabourByPhone` as an async function that returns a promise.
export const findLabourByPhone = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `phone` with type `string`.
    phone: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.labour.findUnique({ where: { organizationId_phone: { organizationId, p…` to the caller.
    return await prisma.labour.findUnique({
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
