// Study: Read and write database records through Prisma for relationships between projects and customers.
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";
// Study: Import `{ Prisma, ProjectCustomerRelationshipType }` from `"@prisma/client"`.
import { Prisma, ProjectCustomerRelationshipType } from "@prisma/client";
// Study: Import `{ UpdateProjectCustomerInput }` from `"./project-customer.types"`.
import { UpdateProjectCustomerInput } from "./project-customer.types";

// Study: Export `createProjectCustomer` as an async function that returns a promise.
export const createProjectCustomer = async (
    // Study: Accept `data` with type `{ projectId: string; customerId: string; relationshipType: ProjectCustomerRelations…`.
    data: {
        // Study: Define `projectId` with type `string`.
        projectId: string;
        // Study: Define `customerId` with type `string`.
        customerId: string;
        // Study: Define `relationshipType` with type `ProjectCustomerRelationshipType`.
        relationshipType: ProjectCustomerRelationshipType;
        // Study: Define `isPrimary` as optional with type `boolean`.
        isPrimary?: boolean;
    // Study: Close the object type.
    },
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Return `await db.projectCustomer.create({ data, })` to the caller.
    return await db.projectCustomer.create({
        // Study: Pass the current `data` value under the same property name.
        data,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findProjectCustomersByProjectId` as an async function that returns a promise.
export const findProjectCustomersByProjectId = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Return `await db.projectCustomer.findMany({ where: { projectId, }, orderBy: { createdAt: "a…` to the caller.
    return await db.projectCustomer.findMany({
        // Study: Set the conditions that database records must match using projectId.
        where: {
            // Study: Pass the current `projectId` value under the same property name.
            projectId,
        // Study: Close the object literal.
        },
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `createdAt` to `"asc"`.
            createdAt: "asc",
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findProjectCustomerByProjectAndCustomer` as an async function that returns a promise.
export const findProjectCustomerByProjectAndCustomer = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Return `await db.projectCustomer.findFirst({ where: { projectId, customerId, }, })` to the caller.
    return await db.projectCustomer.findFirst({
        // Study: Set the conditions that database records must match using projectId, customerId.
        where: {
            // Study: Pass the current `projectId` value under the same property name.
            projectId,
            // Study: Pass the current `customerId` value under the same property name.
            customerId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findProjectCustomerById` as an async function that returns a promise.
export const findProjectCustomerById = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `projectCustomerId` with type `string`.
    projectCustomerId: string,
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Return `await db.projectCustomer.findFirst({ where: { id: projectCustomerId, projectId, }, })` to the caller.
    return await db.projectCustomer.findFirst({
        // Study: Set the conditions that database records must match using id, projectId.
        where: {
            // Study: Set `id` to `projectCustomerId`.
            id: projectCustomerId,
            // Study: Pass the current `projectId` value under the same property name.
            projectId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findProjectCustomerByRelationship` as an async function that returns a promise.
export const findProjectCustomerByRelationship = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `relationshipType` with type `ProjectCustomerRelationshipType`.
    relationshipType: ProjectCustomerRelationshipType,
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Return `await db.projectCustomer.findFirst({ where: { projectId, customerId, relationshipTy…` to the caller.
    return await db.projectCustomer.findFirst({
        // Study: Set the conditions that database records must match using projectId, customerId, relationshipType.
        where: {
            // Study: Pass the current `projectId` value under the same property name.
            projectId,
            // Study: Pass the current `customerId` value under the same property name.
            customerId,
            // Study: Pass the current `relationshipType` value under the same property name.
            relationshipType,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `updateProjectCustomer` as an async function that returns a promise.
export const updateProjectCustomer = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `projectCustomerId` with type `string`.
    projectCustomerId: string,
    // Study: Accept `data` with type `UpdateProjectCustomerInput`.
    data: UpdateProjectCustomerInput,
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    
    // Study: Build the object `updateData` with the entries below.
    const updateData: Prisma.ProjectCustomerUpdateManyMutationInput = {};

    // Study: Run the following branch when `data.relationshipType !== undefined` is truthy.
    if (data.relationshipType !== undefined) {
        // Study: Assign `data.relationshipType` to `updateData.relationshipType`.
        updateData.relationshipType = data.relationshipType;
    // Study: Close the code block.
    }

    // Study: Run the following branch when `data.isPrimary !== undefined` is truthy.
    if (data.isPrimary !== undefined) {
        // Study: Assign `data.isPrimary` to `updateData.isPrimary`.
        updateData.isPrimary = data.isPrimary;
    // Study: Close the code block.
    }

    // Study: Call `db.projectCustomer.updateMany` and wait for it to finish and store its result in `result`.
    const result = await db.projectCustomer.updateMany({
        // Study: Set the conditions that database records must match using id, projectId.
        where: {
            // Study: Set `id` to `projectCustomerId`.
            id: projectCustomerId,
            // Study: Pass the current `projectId` value under the same property name.
            projectId,
        // Study: Close the object literal.
        },
        // Study: Set `data` to `updateData`.
        data: updateData,
    // Study: Close the object literal.
    });

    // Study: Run the following branch when `result.count === 0` is truthy.
    if (result.count === 0) {
        // Study: Return `null` to the caller.
        return null;
    // Study: Close the code block.
    }

    // Study: Return `await db.projectCustomer.findFirst({ where: { id: projectCustomerId, projectId, }, })` to the caller.
    return await db.projectCustomer.findFirst({
        // Study: Set the conditions that database records must match using id, projectId.
        where: {
            // Study: Set `id` to `projectCustomerId`.
            id: projectCustomerId,
            // Study: Pass the current `projectId` value under the same property name.
            projectId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `deleteProjectCustomer` as an async function that returns a promise.
export const deleteProjectCustomer = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `projectCustomerId` with type `string`.
    projectCustomerId: string,
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Call `db.projectCustomer.deleteMany` and wait for it to finish and store its result in `result`.
    const result = await db.projectCustomer.deleteMany({
        // Study: Set the conditions that database records must match using id, projectId.
        where: {
            // Study: Set `id` to `projectCustomerId`.
            id: projectCustomerId,
            // Study: Pass the current `projectId` value under the same property name.
            projectId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });

    // Study: Return `result.count > 0` to the caller.
    return result.count > 0;
// Study: Close the code block.
};

// Study: Export `clearPrimaryProjectCustomer` as an async function that returns a promise.
export const clearPrimaryProjectCustomer = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Return `await db.projectCustomer.updateMany({ where: { projectId, isPrimary: true, }, data:…` to the caller.
    return await db.projectCustomer.updateMany({
        // Study: Set the conditions that database records must match using projectId, isPrimary.
        where: {
            // Study: Pass the current `projectId` value under the same property name.
            projectId,
            // Study: Set `isPrimary` to `true`.
            isPrimary: true,
        // Study: Close the object literal.
        },
        // Study: Supply the values to write to the database.
        data: {
            // Study: Set `isPrimary` to `false`.
            isPrimary: false,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};
