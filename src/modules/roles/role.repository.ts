import prisma from "../../lib/prisma";

import {
    CreateRoleData,
    OrganizationRole,
    OrganizationRoleWithPermissions,
    Role,
    UpdateRoleData,
    organizationRoleSelect,
    organizationRoleWithPermissionsSelect,
    roleSelect,
} from "./role.types";

/////////////////////////////////////////////////
// GLOBAL ROLE OPERATIONS
/////////////////////////////////////////////////

/**
 * Create a global role.
 *
 * A global role is created by SUPER_ADMIN.
 * After creation, an OrganizationRole is created
 * for every existing organization.
 */
export const createGlobalRole = async (
    data: CreateRoleData
): Promise<Role> => {
    return await prisma.$transaction(async (tx) => {
        // Create global role
        const role = await tx.role.create({
            data: {
                name: data.name,
                description: data.description,
                isGlobal: true,
            },
            select: roleSelect,
        });

        // Get all organizations
        const organizations = await tx.organization.findMany({
            select: {
                id: true,
            },
        });

        // Create this role for every organization
        if (organizations.length > 0) {
            await tx.organizationRole.createMany({
                data: organizations.map((organization) => ({
                    organizationId: organization.id,
                    roleId: role.id,
                })),
            });
        }

        return role;
    });
};

/**
 * Find all global roles.
 */
export const findGlobalRoles = async (): Promise<Role[]> => {
    return await prisma.role.findMany({
        where: {
            isGlobal: true,
        },
        select: roleSelect,
        orderBy: {
            createdAt: "desc",
        },
    });
};

/**
 * Find a global role by ID.
 */
export const findGlobalRoleById = async (
    id: string
): Promise<Role | null> => {
    return await prisma.role.findFirst({
        where: {
            id,
            isGlobal: true,
        },
        select: roleSelect,
    });
};

/**
 * Find a global role by name.
 */
export const findGlobalRoleByName = async (
    name: string
): Promise<Role | null> => {
    return await prisma.role.findFirst({
        where: {
            name,
            isGlobal: true,
        },
        select: roleSelect,
    });
};

/**
 * Update a global role.
 */
export const updateGlobalRole = async (
    id: string,
    data: UpdateRoleData
): Promise<Role> => {
    return await prisma.role.update({
        where: {
            id,
        },
        data: {
            name: data.name,
            description: data.description,
        },
        select: roleSelect,
    });
};

/**
 * Delete a global role.
 *
 * OrganizationRole records will be deleted automatically
 * because of the Cascade relation in the Prisma schema.
 */
export const deleteGlobalRole = async (
    id: string
): Promise<Role> => {
    return await prisma.role.delete({
        where: {
            id,
        },
        select: roleSelect,
    });
};

/////////////////////////////////////////////////
// ORGANIZATION ROLE OPERATIONSs
/////////////////////////////////////////////////

/**
 * Create an organization-specific role.
 *
 * This is used by ORGANIZATION_OWNER.
 */
export const createOrganizationRole = async (
    organizationId: string,
    data: CreateRoleData
): Promise<OrganizationRoleWithPermissions> => {
    return await prisma.$transaction(async (tx) => {
        const role = await tx.role.create({
            data: {
                name: data.name,
                description: data.description,
                isGlobal: false,
                organizationId,
            }
        });

        return await tx.organizationRole.create({
            data: {
                organizationId,
                roleId: role.id,
                rolePermissions: data.permissionIds?.length
                    ? {
                          create: data.permissionIds.map((permissionId) => ({
                              permissionId,
                          })),
                      }
                    : undefined,
            },
            select: organizationRoleWithPermissionsSelect,
        });
    });
};

/**
 * Find all roles available to an organization.
 *
 * This includes:
 * - Global roles assigned to the organization
 * - Organization-specific roles
 */
export const findOrganizationRoles = async (
    organizationId: string
): Promise<OrganizationRole[]> => {
    return await prisma.organizationRole.findMany({
        where: {
            organizationId,
        },

        select: organizationRoleSelect,

        orderBy: {
            createdAt: "desc",
        },
    });
};

/**
 * Find an organization role by ID.
 */
export const findOrganizationRoleById = async (
    id: string,
    organizationId: string
): Promise<OrganizationRole | null> => {
    return await prisma.organizationRole.findFirst({
        where: {
            id,
            organizationId,
        },

        select: organizationRoleSelect,
    });
};

/**
 * Find an organization role by ID with permissions.
 */
export const findOrganizationRoleByIdWithPermissions = async (
    id: string,
    organizationId: string
): Promise<OrganizationRoleWithPermissions | null> => {
    return await prisma.organizationRole.findFirst({
        where: {
            id,
            organizationId,
        },

        select: organizationRoleWithPermissionsSelect,
    });
};

/**
 * Find an organization's role by role name.
 */
export const findOrganizationRoleByName = async (
    organizationId: string,
    name: string
): Promise<OrganizationRole | null> => {
    return await prisma.organizationRole.findFirst({
        where: {
            organizationId,

            role: {
                name,
            },
        },

        select: organizationRoleSelect,
    });
};

/**
 * Update an organization role.
 *
 * The role name and description belong to the underlying Role.
 * Permissions belong to the OrganizationRole.
 */
export const updateOrganizationRole = async (
    id: string,
    organizationId: string,
    data: UpdateRoleData
): Promise<OrganizationRoleWithPermissions> => {
    return await prisma.$transaction(async (tx) => {
        const organizationRole = await tx.organizationRole.findFirst({
            where: {
                id,
                organizationId,
            },

            select: {
                id: true,
                roleId: true,
            },
        });

        if (!organizationRole) {
            throw new Error("Organization role not found.");
        }

        // Update role information if provided
        if (
            data.name !== undefined ||
            data.description !== undefined
        ) {
            await tx.role.update({
                where: {
                    id: organizationRole.roleId,
                },

                data: {
                    ...(data.name !== undefined && {
                        name: data.name,
                    }),

                    ...(data.description !== undefined && {
                        description: data.description,
                    }),
                },
            });
        }

        // Update permissions if provided
        if (data.permissionIds !== undefined) {
            await tx.rolePermission.deleteMany({
                where: {
                    organizationRoleId: id,
                },
            });

            if (data.permissionIds.length > 0) {
                await tx.rolePermission.createMany({
                    data: data.permissionIds.map((permissionId) => ({
                        organizationRoleId: id,
                        permissionId,
                    })),
                });
            }
        }

        return await tx.organizationRole.findUniqueOrThrow({
            where: {
                id,
            },

            select: organizationRoleWithPermissionsSelect,
        });
    });
};

/**
 * Delete an organization role.
 */
export const deleteOrganizationRole = async (
    id: string,
    organizationId: string
): Promise<OrganizationRole> => {
    return await prisma.organizationRole.delete({
        where: {
            id,
            organizationId,
        },

        select: organizationRoleSelect,
    });
};

/**
 * Count users assigned to an organization role.
 */
export const countUsersWithOrganizationRole = async (
    organizationRoleId: string
): Promise<number> => {
    return await prisma.user.count({
        where: {
            organizationRoleId,
        },
    });
};