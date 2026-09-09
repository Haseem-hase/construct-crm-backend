import prisma from "../../lib/prisma";
import {
    CreateCustomerContactInput,
    UpdateCustomerContactInput
} from "./customer-contact.types";
import { Prisma } from "@prisma/client";

export const createCustomerContact = async (
    customerId: string,
    data: CreateCustomerContactInput,
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    return await db.customerContact.create({
        data: {
            ...data,
            customerId,
        },
    });
};

export const unsetPrimaryContacts = async (
    customerId: string,
    excludeContactId?: string,
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    return await db.customerContact.updateMany({
        where: {
            customerId,
            isPrimary: true,
            ...(excludeContactId ? { id: { not: excludeContactId } } : {})
        },
        data: { isPrimary: false },
    });
};

export const findContactsByCustomerId = async (
    customerId: string,
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    return await db.customerContact.findMany({
        where: { customerId },
        orderBy: { createdAt: "desc" },
    });
};

export const findContactById = async (
    contactId: string,
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    return await db.customerContact.findUnique({
        where: { id: contactId },
    });
};

export const findContactByIdAndCustomer = async (
    contactId: string,
    customerId: string,
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    return await db.customerContact.findFirst({
        where: {
            id: contactId,
            customerId: customerId,
        },
    });
};

export const updateCustomerContact = async (
    contactId: string,
    customerId: string,
    data: UpdateCustomerContactInput,
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    const result = await db.customerContact.updateMany({
        where: {
            id: contactId,
            customerId,
        },
        data,
    });

    if (result.count === 0) {
        return null;
    }

    return await db.customerContact.findFirst({
        where: {
            id: contactId,
            customerId,
        },
    });
};

export const deleteCustomerContact = async (
    contactId: string,
    customerId: string,
    tx?: Prisma.TransactionClient
) => {
    const db = tx || prisma;
    const result = await db.customerContact.deleteMany({
        where: {
            id: contactId,
            customerId: customerId,
        },
    });

    return result.count > 0;
};
