import { Prisma } from "@prisma/client";
import { CreateRoleInput, UpdateRoleInput } from "./role.validation";

// Create role
export type CreateRoleData = CreateRoleInput;

// Update role
export type UpdateRoleData = UpdateRoleInput;

// Basic global Role
export const roleSelect = {
    id: true,
    name: true,
    description: true,
    isGlobal: true,
    createdAt: true,
    updatedAt: true,
} as const;

export type Role = Prisma.RoleGetPayload<{
    select: typeof roleSelect;
}>;

// Organization Role with the underlying global role
export const organizationRoleSelect = {
    id: true,
    organizationId: true,
    roleId: true,

    role: {
        select: {
            id: true,
            name: true,
            description: true,
            isGlobal: true,
        },
    },

    createdAt: true,
    updatedAt: true,
} as const;

export type OrganizationRole = Prisma.OrganizationRoleGetPayload<{
    select: typeof organizationRoleSelect;
}>;

// Organization Role with permissions
export const organizationRoleWithPermissionsSelect = {
    id: true,
    organizationId: true,
    roleId: true,

    role: {
        select: {
            id: true,
            name: true,
            description: true,
            isGlobal: true,
        },
    },

    rolePermissions: {
        select: {
            permission: {
                select: {
                    id: true,
                    module: true,
                    action: true,
                    description: true,
                },
            },
        },
    },

    createdAt: true,
    updatedAt: true,
} as const;

export type OrganizationRoleWithPermissions =
    Prisma.OrganizationRoleGetPayload<{
        select: typeof organizationRoleWithPermissionsSelect;
    }>;