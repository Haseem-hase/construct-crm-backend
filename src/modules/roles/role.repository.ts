import prisma from "../../lib/prisma";
import {
    CreateRoleData,
    Role,
    RoleWithPermissions,
    UpdateRoleData,
    roleSelect,
    roleWithPermissionsSelect,
} from "./role.types";


/**
 * Create a role
 */
export const createRole = async (
    organizationId: string,
    data: CreateRoleData
): Promise<Role> => {
    return await prisma.role.create({
        data: {
            name: data.name,
            description: data.description,
            organizationId,

            rolePermissions: data.permissionIds?.length
                ? {
                      create: data.permissionIds.map((permissionId) => ({
                          permissionId,
                      })),
                  }
                : undefined,
        },

        select: roleSelect,
    });
};


/**
 * Find all roles belonging to an organization
 */
export const findRolesByOrganization = async (
    organizationId: string
): Promise<Role[]> => {
    return await prisma.role.findMany({
        where: {
            organizationId,
        },

        select: roleSelect,

        orderBy: {
            createdAt: "desc",
        },
    });
};


/**
 * Find a role by ID
 */
export const findRoleById = async (
    id: string
): Promise<Role | null> => {
    return await prisma.role.findUnique({
        where: {
            id,
        },

        select: roleSelect,
    });
};


/**
 * Find a role by ID with its permissions
 */
export const findRoleByIdWithPermissions = async (
    id: string
): Promise<RoleWithPermissions | null> => {
    return await prisma.role.findUnique({
        where: {
            id,
        },

        select: roleWithPermissionsSelect,
    });
};


/**
 * Find a role by name inside an organization
 */
export const findRoleByName = async (
    organizationId: string,
    name: string
): Promise<Role | null> => {
    return await prisma.role.findUnique({
        where: {
            organizationId_name: {
                organizationId,
                name,
            },
        },

        select: roleSelect,
    });
};


/**
 * Update a role
 */
export const updateRole = async (
    id: string,
    data: UpdateRoleData
): Promise<Role> => {
    return await prisma.$transaction(async (tx) => {

        /**
         * Update basic role information
         */
        const role = await tx.role.update({
            where: {
                id,
            },

            data: {
                name: data.name,
                description: data.description,
            },

            select: roleSelect,
        });


        /**
         * Update permissions if permissionIds
         * were provided.
         */
        if (data.permissionIds !== undefined) {

            await tx.rolePermission.deleteMany({
                where: {
                    roleId: id,
                },
            });


            if (data.permissionIds.length > 0) {

                await tx.rolePermission.createMany({
                    data: data.permissionIds.map((permissionId) => ({
                        roleId: id,
                        permissionId,
                    })),
                });

            }
        }

        return role;
    });
};


/**
 * Delete a role
 */
export const deleteRole = async (
    id: string
): Promise<Role> => {
    return await prisma.role.delete({
        where: {
            id,
        },

        select: roleSelect,
    });
};


/**
 * Check whether a role has users
 */
export const countUsersWithRole = async (
    roleId: string
): Promise<number> => {
    return await prisma.user.count({
        where: {
            roleId,
        },
    });
};