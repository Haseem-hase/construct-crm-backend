// Study: Read and write database records through Prisma for contacts attached to customer accounts.
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";
// Study: Import `{ CreateCustomerContactInput, UpdateCustomerContactInput }` from `"./customer-contact.types"`.
import {
    // Study: Bring `CreateCustomerContactInput` into scope from the imported module.
    CreateCustomerContactInput,
    // Study: Bring `UpdateCustomerContactInput` into scope from the imported module.
    UpdateCustomerContactInput
// Study: Close this group and continue the enclosing expression.
} from "./customer-contact.types";
// Study: Import `{ Prisma }` from `"@prisma/client"`.
import { Prisma } from "@prisma/client";

// Study: Export `createCustomerContact` as an async function that returns a promise.
export const createCustomerContact = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `data` with type `CreateCustomerContactInput`.
    data: CreateCustomerContactInput,
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Return `await db.customerContact.create({ data: { ...data, customerId, }, })` to the caller.
    return await db.customerContact.create({
        // Study: Supply the values to write to the database.
        data: {
            // Study: Expand the values from `data` into the surrounding collection.
            ...data,
            // Study: Pass the current `customerId` value under the same property name.
            customerId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `unsetPrimaryContacts` as an async function that returns a promise.
export const unsetPrimaryContacts = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `excludeContactId` as optional with type `string`.
    excludeContactId?: string,
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Return `await db.customerContact.updateMany({ where: { customerId, isPrimary: true, ...(exc…` to the caller.
    return await db.customerContact.updateMany({
        // Study: Set the conditions that database records must match using customerId, isPrimary.
        where: {
            // Study: Pass the current `customerId` value under the same property name.
            customerId,
            // Study: Set `isPrimary` to `true`.
            isPrimary: true,
            // Study: Expand the values from `(excludeContactId ? { id: { not: excludeContactId } } : {})` into the surrounding collection.
            ...(excludeContactId ? { id: { not: excludeContactId } } : {})
        // Study: Close the object literal.
        },
        // Study: Supply the values to write to the database.
        data: { isPrimary: false },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findContactsByCustomerId` as an async function that returns a promise.
export const findContactsByCustomerId = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Return `await db.customerContact.findMany({ where: { customerId }, orderBy: { createdAt: "d…` to the caller.
    return await db.customerContact.findMany({
        // Study: Set the conditions that database records must match using customerId.
        where: { customerId },
        // Study: Set the sort order for the returned records.
        orderBy: { createdAt: "desc" },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findContactById` as an async function that returns a promise.
export const findContactById = async (
    // Study: Accept `contactId` with type `string`.
    contactId: string,
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Return `await db.customerContact.findUnique({ where: { id: contactId }, })` to the caller.
    return await db.customerContact.findUnique({
        // Study: Set the conditions that database records must match using id.
        where: { id: contactId },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findContactByIdAndCustomer` as an async function that returns a promise.
export const findContactByIdAndCustomer = async (
    // Study: Accept `contactId` with type `string`.
    contactId: string,
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Return `await db.customerContact.findFirst({ where: { id: contactId, customerId: customerId…` to the caller.
    return await db.customerContact.findFirst({
        // Study: Set the conditions that database records must match using id, customerId.
        where: {
            // Study: Set `id` to `contactId`.
            id: contactId,
            // Study: Set `customerId` to `customerId`.
            customerId: customerId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `updateCustomerContact` as an async function that returns a promise.
export const updateCustomerContact = async (
    // Study: Accept `contactId` with type `string`.
    contactId: string,
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `data` with type `UpdateCustomerContactInput`.
    data: UpdateCustomerContactInput,
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Call `db.customerContact.updateMany` and wait for it to finish and store its result in `result`.
    const result = await db.customerContact.updateMany({
        // Study: Set the conditions that database records must match using id, customerId.
        where: {
            // Study: Set `id` to `contactId`.
            id: contactId,
            // Study: Pass the current `customerId` value under the same property name.
            customerId,
        // Study: Close the object literal.
        },
        // Study: Pass the current `data` value under the same property name.
        data,
    // Study: Close the object literal.
    });

    // Study: Run the following branch when `result.count === 0` is truthy.
    if (result.count === 0) {
        // Study: Return `null` to the caller.
        return null;
    // Study: Close the code block.
    }

    // Study: Return `await db.customerContact.findFirst({ where: { id: contactId, customerId, }, })` to the caller.
    return await db.customerContact.findFirst({
        // Study: Set the conditions that database records must match using id, customerId.
        where: {
            // Study: Set `id` to `contactId`.
            id: contactId,
            // Study: Pass the current `customerId` value under the same property name.
            customerId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `deleteCustomerContact` as an async function that returns a promise.
export const deleteCustomerContact = async (
    // Study: Accept `contactId` with type `string`.
    contactId: string,
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `tx` as optional with type `Prisma.TransactionClient`.
    tx?: Prisma.TransactionClient
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `db` to `tx || prisma`.
    const db = tx || prisma;
    // Study: Call `db.customerContact.deleteMany` and wait for it to finish and store its result in `result`.
    const result = await db.customerContact.deleteMany({
        // Study: Set the conditions that database records must match using id, customerId.
        where: {
            // Study: Set `id` to `contactId`.
            id: contactId,
            // Study: Set `customerId` to `customerId`.
            customerId: customerId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });

    // Study: Return `result.count > 0` to the caller.
    return result.count > 0;
// Study: Close the code block.
};
