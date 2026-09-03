import prisma from "../../lib/prisma";
import { CreateOrganizationInput } from "./organization.types";

export const createOrganizationWithOwner = async (
    data: CreateOrganizationInput
) => {
    return prisma.$transaction(async (tx) => {
        const organization = await tx.organization.create({
            data: {
                name: data.organizationName,
            },
        });

        // Fetch all global roles
        const globalRoles = await tx.role.findMany({
            where: { isGlobal: true },
        });

        // Create OrganizationRole records for each global role
        if (globalRoles.length > 0) {
            await tx.organizationRole.createMany({
                data: globalRoles.map((role) => ({
                    organizationId: organization.id,
                    roleId: role.id,
                })),
            });
        }

        // We need the ID of the OrganizationRole for the owner to assign to the user
        const ownerOrgRole = await tx.organizationRole.findFirst({
            where: {
                organizationId: organization.id,
                roleId: data.roleId, // data.roleId is the global Role.id of ORGANIZATION_OWNER
            },
        });

        if (!ownerOrgRole) {
            throw new Error("Failed to assign owner role to the new organization.");
        }

        const user = await tx.user.create({
            data: {
                fullName: data.fullName,
                email: data.email,
                phone: data.phone,
                password: data.password,
                organizationRoleId: ownerOrgRole.id,
                organizationId: organization.id,
            },
        });

        return {
            organization,
            user,
        };
    });
};