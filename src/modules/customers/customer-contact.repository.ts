import prisma from "../../lib/prisma";
import {
    CreateCustomerContactInput,
    UpdateCustomerContactInput
} from "./customer-contact.types";

export const createCustomerContact = async (
    customerId: string,
    data: CreateCustomerContactInput
) => {
    return await prisma.customerContact.create({
        data: {
            ...data,
            customerId,
        },
    });
};

export const findContactsByCustomerId = async (
    customerId: string
) => {
    return await prisma.customerContact.findMany({
        where: { customerId },
        orderBy: { createdAt: "desc" },
    });
};

export const findContactById = async (
    contactId: string
) => {
    return await prisma.customerContact.findUnique({
        where: { id: contactId },
    });
};

export const findContactByIdAndCustomer = async (
    contactId: string,
    customerId: string
) => {
    return await prisma.customerContact.findFirst({
        where: {
            id: contactId,
            customerId: customerId,
        },
    });
};

export const updateCustomerContact = async (
    contactId: string,
    customerId: string,
    data: UpdateCustomerContactInput
) => {
    const result = await prisma.customerContact.updateMany({
        where: {
            id: contactId,
            customerId,
        },
        data,
    });

    if (result.count === 0) {
        return null;
    }

    return await prisma.customerContact.findFirst({
        where: {
            id: contactId,
            customerId,
        },
    });
};

export const deleteCustomerContact = async (
    contactId: string,
    customerId: string
) => {
    const result = await prisma.customerContact.deleteMany({
        where: {
            id: contactId,
            customerId: customerId,
        },
    });

    return result.count > 0;
};
