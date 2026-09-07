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
            type: data.type,
            profileImageUrl: data.profileImageUrl,
            
            country: data.country,
            city: data.city,
            address: data.address,
            
            parentCustomerId: data.parentCustomerId,
            
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



export const updateCustomer = async (
    customerId: string,
    organizationId: string,
    data: UpdateCustomerInput
) => {
    const result = await prisma.customer.updateMany({
        where: {
            id: customerId,
            organizationId,
        },
        data: {
            ...data,
        },
    });

    if (result.count === 0) {
        return null;
    }

    return await prisma.customer.findFirst({
        where: { 
            id: customerId,
            organizationId
        }
    });
};


export const deleteCustomer = async (
    customerId: string,
    organizationId: string
) => {
    const result = await prisma.customer.deleteMany({
        where: {
            id: customerId,
            organizationId,
        },
    });
    
    return result.count > 0;
};