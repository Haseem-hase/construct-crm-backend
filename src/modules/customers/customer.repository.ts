import prisma from "../../lib/prisma";

import {
    CreateCustomerInput,
    UpdateCustomerInput,
} from "./customer.types";


export const createCustomer = async (
    data: CreateCustomerInput & {
        organizationId: string;
    }
) => {
    return await prisma.customer.create({
        data: {
            name: data.name,
            customerCode: data.customerCode,
            description: data.description,

            email: data.email,
            phone: data.phone,

            address: data.address,
            city: data.city,
            country: data.country,
            postalCode: data.postalCode,

            organizationId: data.organizationId,
        },
    });
};


export const findCustomersByOrganizationId = async (
    organizationId: string
) => {
    return await prisma.customer.findMany({
        where: {
            organizationId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};


export const findCustomerByIdAndOrganization = async (
    customerId: string,
    organizationId: string
) => {
    return await prisma.customer.findFirst({
        where: {
            id: customerId,
            organizationId,
        },
    });
};


export const findCustomerByCodeAndOrganization = async (
    customerCode: string,
    organizationId: string
) => {
    return await prisma.customer.findFirst({
        where: {
            customerCode,
            organizationId,
        },
    });
};


export const updateCustomer = async (
    customerId: string,
    data: UpdateCustomerInput
) => {
    return await prisma.customer.update({
        where: {
            id: customerId,
        },
        data: {
            ...data,
        },
    });
};


export const deleteCustomer = async (
    customerId: string
) => {
    return await prisma.customer.delete({
        where: {
            id: customerId,
        },
    });
};