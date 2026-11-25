// Study: This file is about which customers are connected to each job and in what role. Finds or saves information in the database, where the CRM keeps its records.
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";
// Study: Bring in `{ Prisma, ProjectCustomerRelationshipType }` from `"@prisma/client"` so this file can use it.
import { Prisma, ProjectCustomerRelationshipType } from "@prisma/client";
// Study: Bring in `{ UpdateProjectCustomerInput }` from `"./project-customer.types"` so this file can use it.
import { UpdateProjectCustomerInput } from "./project-customer.types";

// Study: Make `createProjectCustomer` available to other files. Its result arrives after its work finishes.
export const createProjectCustomer = async (
    // Study: This step receives `data`. `{ projectId: string; customerId: string; relationshipType: ProjectCustomerRelations…` describes what that information should look like.
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
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Give `await db.projectCustomer.create({ data, })` back to the code that asked for it.
    return await db.projectCustomer.create({
        // Study: Carry the value of `data` into the new group under the same name.
        data,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findProjectCustomersByProjectId` available to other files. Its result arrives after its work finishes.
export const findProjectCustomersByProjectId = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Give `await db.projectCustomer.findMany({ where: { projectId, }, orderBy: { createdAt: "a…` back to the code that asked for it.
    return await db.projectCustomer.findMany({
        // Study: Set the conditions that records must meet using projectId.
        where: {
            // Study: Carry the value of `projectId` into the new group under the same name.
            projectId,
        // Study: End this group of values.
        },
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `createdAt` to `"asc"`.
            createdAt: "asc",
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findProjectCustomerByProjectAndCustomer` available to other files. Its result arrives after its work finishes.
export const findProjectCustomerByProjectAndCustomer = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Give `await db.projectCustomer.findFirst({ where: { projectId, customerId, }, })` back to the code that asked for it.
    return await db.projectCustomer.findFirst({
        // Study: Set the conditions that records must meet using projectId, customerId.
        where: {
            // Study: Carry the value of `projectId` into the new group under the same name.
            projectId,
            // Study: Carry the value of `customerId` into the new group under the same name.
            customerId,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findProjectCustomerById` available to other files. Its result arrives after its work finishes.
export const findProjectCustomerById = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `projectCustomerId`. `string` describes what that information should look like.
    projectCustomerId: string,
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Give `await db.projectCustomer.findFirst({ where: { id: projectCustomerId, projectId, }, })` back to the code that asked for it.
    return await db.projectCustomer.findFirst({
        // Study: Set the conditions that records must meet using id, projectId.
        where: {
            // Study: Set `id` to `projectCustomerId`.
            id: projectCustomerId,
            // Study: Carry the value of `projectId` into the new group under the same name.
            projectId,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findProjectCustomerByRelationship` available to other files. Its result arrives after its work finishes.
export const findProjectCustomerByRelationship = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `relationshipType`. `ProjectCustomerRelationshipType` describes what that information should look like.
    relationshipType: ProjectCustomerRelationshipType,
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Give `await db.projectCustomer.findFirst({ where: { projectId, customerId, relationshipTy…` back to the code that asked for it.
    return await db.projectCustomer.findFirst({
        // Study: Set the conditions that records must meet using projectId, customerId, relationshipType.
        where: {
            // Study: Carry the value of `projectId` into the new group under the same name.
            projectId,
            // Study: Carry the value of `customerId` into the new group under the same name.
            customerId,
            // Study: Carry the value of `relationshipType` into the new group under the same name.
            relationshipType,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `updateProjectCustomer` available to other files. Its result arrives after its work finishes.
export const updateProjectCustomer = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `projectCustomerId`. `string` describes what that information should look like.
    projectCustomerId: string,
    // Study: This step receives `data`. `UpdateProjectCustomerInput` describes what that information should look like.
    data: UpdateProjectCustomerInput,
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    
    // Study: Build the object `updateData` with the entries below.
    const updateData: Prisma.ProjectCustomerUpdateManyMutationInput = {};

    // Study: Do the next step if this check passes: `data.relationshipType !== undefined`.
    if (data.relationshipType !== undefined) {
        // Study: Assign `data.relationshipType` to `updateData.relationshipType`.
        updateData.relationshipType = data.relationshipType;
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `data.isPrimary !== undefined`.
    if (data.isPrimary !== undefined) {
        // Study: Assign `data.isPrimary` to `updateData.isPrimary`.
        updateData.isPrimary = data.isPrimary;
    // Study: End this group of steps.
    }

    // Study: Call `db.projectCustomer.updateMany` and wait for it to finish and store its result in `result`.
    const result = await db.projectCustomer.updateMany({
        // Study: Set the conditions that records must meet using id, projectId.
        where: {
            // Study: Set `id` to `projectCustomerId`.
            id: projectCustomerId,
            // Study: Carry the value of `projectId` into the new group under the same name.
            projectId,
        // Study: End this group of values.
        },
        // Study: Set `data` to `updateData`.
        data: updateData,
    // Study: End this group of values.
    });

    // Study: Do the next step if this check passes: `result.count === 0`.
    if (result.count === 0) {
        // Study: Give `null` back to the code that asked for it.
        return null;
    // Study: End this group of steps.
    }

    // Study: Give `await db.projectCustomer.findFirst({ where: { id: projectCustomerId, projectId, }, })` back to the code that asked for it.
    return await db.projectCustomer.findFirst({
        // Study: Set the conditions that records must meet using id, projectId.
        where: {
            // Study: Set `id` to `projectCustomerId`.
            id: projectCustomerId,
            // Study: Carry the value of `projectId` into the new group under the same name.
            projectId,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `deleteProjectCustomer` available to other files. Its result arrives after its work finishes.
export const deleteProjectCustomer = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `projectCustomerId`. `string` describes what that information should look like.
    projectCustomerId: string,
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Call `db.projectCustomer.deleteMany` and wait for it to finish and store its result in `result`.
    const result = await db.projectCustomer.deleteMany({
        // Study: Set the conditions that records must meet using id, projectId.
        where: {
            // Study: Set `id` to `projectCustomerId`.
            id: projectCustomerId,
            // Study: Carry the value of `projectId` into the new group under the same name.
            projectId,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });

    // Study: Give `result.count > 0` back to the code that asked for it.
    return result.count > 0;
// Study: End this group of steps.
};

// Study: Make `clearPrimaryProjectCustomer` available to other files. Its result arrives after its work finishes.
export const clearPrimaryProjectCustomer = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Give `await db.projectCustomer.updateMany({ where: { projectId, isPrimary: true, }, data:…` back to the code that asked for it.
    return await db.projectCustomer.updateMany({
        // Study: Set the conditions that records must meet using projectId, isPrimary.
        where: {
            // Study: Carry the value of `projectId` into the new group under the same name.
            projectId,
            // Study: Set `isPrimary` to `true`.
            isPrimary: true,
        // Study: End this group of values.
        },
        // Study: Supply the values to write to the database.
        data: {
            // Study: Set `isPrimary` to `false`.
            isPrimary: false,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};
