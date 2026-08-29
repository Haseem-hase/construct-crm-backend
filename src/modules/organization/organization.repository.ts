import prisma from "../../lib/prisma";
import { CreateOrganizationInput } from "./organization.types";

export const createOrganizationWithOwner = async (
    data: CreateOrganizationInput
) => {
    return prisma.$transaction(async (tx) => {
            //we are telling prisma treat these database operation as one transaction means user and organization
        const organization = await tx.organization.create({
            data: {
                name: data.organizationName,
            },
        });

        const user = await tx.user.create({
            data: {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                password: data.password,
                roleId: data.roleId,
                organizationId: organization.id,
            },
        });

        return {
            organization,
            user,
        };
    });
};