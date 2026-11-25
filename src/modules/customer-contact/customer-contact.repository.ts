// Study: This file is about the people you can contact at a customer account. Finds or saves information in the database, where the CRM keeps its records.
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";
// Study: Bring in `{ CreateCustomerContactInput, UpdateCustomerContactInput }` from `"./customer-contact.types"` so this file can use it.
import {
    // Study: Make `CreateCustomerContactInput` from the other file available here.
    CreateCustomerContactInput,
    // Study: Make `UpdateCustomerContactInput` from the other file available here.
    UpdateCustomerContactInput
// Study: Finish this group and continue the surrounding step.
} from "./customer-contact.types";
// Study: Bring in `{ Prisma }` from `"@prisma/client"` so this file can use it.
import { Prisma } from "@prisma/client";

// Study: Make `createCustomerContact` available to other files. Its result arrives after its work finishes.
export const createCustomerContact = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `data`. `CreateCustomerContactInput` describes what that information should look like.
    data: CreateCustomerContactInput,
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Give `await db.customerContact.create({ data: { ...data, customerId, }, })` back to the code that asked for it.
    return await db.customerContact.create({
        // Study: Supply the values to write to the database.
        data: {
            // Study: Expand the values from `data` into the surrounding collection.
            ...data,
            // Study: Carry the value of `customerId` into the new group under the same name.
            customerId,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `unsetPrimaryContacts` available to other files. Its result arrives after its work finishes.
export const unsetPrimaryContacts = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `excludeContactId` as optional. `string` describes what that information should look like.
    excludeContactId?: string,
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Give `await db.customerContact.updateMany({ where: { customerId, isPrimary: true, ...(exc…` back to the code that asked for it.
    return await db.customerContact.updateMany({
        // Study: Set the conditions that records must meet using customerId, isPrimary.
        where: {
            // Study: Carry the value of `customerId` into the new group under the same name.
            customerId,
            // Study: Set `isPrimary` to `true`.
            isPrimary: true,
            // Study: Expand the values from `(excludeContactId ? { id: { not: excludeContactId } } : {})` into the surrounding collection.
            ...(excludeContactId ? { id: { not: excludeContactId } } : {})
        // Study: End this group of values.
        },
        // Study: Supply the values to write to the database.
        data: { isPrimary: false },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findContactsByCustomerId` available to other files. Its result arrives after its work finishes.
export const findContactsByCustomerId = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Give `await db.customerContact.findMany({ where: { customerId }, orderBy: { createdAt: "d…` back to the code that asked for it.
    return await db.customerContact.findMany({
        // Study: Set the conditions that records must meet using customerId.
        where: { customerId },
        // Study: Set the sort order for the returned records.
        orderBy: { createdAt: "desc" },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findContactById` available to other files. Its result arrives after its work finishes.
export const findContactById = async (
    // Study: This step receives `contactId`. `string` describes what that information should look like.
    contactId: string,
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Give `await db.customerContact.findUnique({ where: { id: contactId }, })` back to the code that asked for it.
    return await db.customerContact.findUnique({
        // Study: Set the conditions that records must meet using id.
        where: { id: contactId },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findContactByIdAndCustomer` available to other files. Its result arrives after its work finishes.
export const findContactByIdAndCustomer = async (
    // Study: This step receives `contactId`. `string` describes what that information should look like.
    contactId: string,
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Give `await db.customerContact.findFirst({ where: { id: contactId, customerId: customerId…` back to the code that asked for it.
    return await db.customerContact.findFirst({
        // Study: Set the conditions that records must meet using id, customerId.
        where: {
            // Study: Set `id` to `contactId`.
            id: contactId,
            // Study: Set `customerId` to `customerId`.
            customerId: customerId,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `updateCustomerContact` available to other files. Its result arrives after its work finishes.
export const updateCustomerContact = async (
    // Study: This step receives `contactId`. `string` describes what that information should look like.
    contactId: string,
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `data`. `UpdateCustomerContactInput` describes what that information should look like.
    data: UpdateCustomerContactInput,
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Call `db.customerContact.updateMany` and wait for it to finish and store its result in `result`.
    const result = await db.customerContact.updateMany({
        // Study: Set the conditions that records must meet using id, customerId.
        where: {
            // Study: Set `id` to `contactId`.
            id: contactId,
            // Study: Carry the value of `customerId` into the new group under the same name.
            customerId,
        // Study: End this group of values.
        },
        // Study: Carry the value of `data` into the new group under the same name.
        data,
    // Study: End this group of values.
    });

    // Study: Do the next step if this check passes: `result.count === 0`.
    if (result.count === 0) {
        // Study: Give `null` back to the code that asked for it.
        return null;
    // Study: End this group of steps.
    }

    // Study: Give `await db.customerContact.findFirst({ where: { id: contactId, customerId, }, })` back to the code that asked for it.
    return await db.customerContact.findFirst({
        // Study: Set the conditions that records must meet using id, customerId.
        where: {
            // Study: Set `id` to `contactId`.
            id: contactId,
            // Study: Carry the value of `customerId` into the new group under the same name.
            customerId,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `deleteCustomerContact` available to other files. Its result arrives after its work finishes.
export const deleteCustomerContact = async (
    // Study: This step receives `contactId`. `string` describes what that information should look like.
    contactId: string,
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `tx` as optional. `Prisma.TransactionClient` describes what that information should look like.
    tx?: Prisma.TransactionClient
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Call `db.customerContact.deleteMany` and wait for it to finish and store its result in `result`.
    const result = await db.customerContact.deleteMany({
        // Study: Set the conditions that records must meet using id, customerId.
        where: {
            // Study: Set `id` to `contactId`.
            id: contactId,
            // Study: Set `customerId` to `customerId`.
            customerId: customerId,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });

    // Study: Give `result.count > 0` back to the code that asked for it.
    return result.count > 0;
// Study: End this group of steps.
};
