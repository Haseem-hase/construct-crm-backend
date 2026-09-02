import { Prisma } from "@prisma/client";

import {
    CreateRoleInput,
    UpdateRoleInput,
} from "./role.validation";


// ======================================================
// CREATE ROLE
// ======================================================

export type CreateRoleData = CreateRoleInput;


// ======================================================
// UPDATE ROLE
// ======================================================

export type UpdateRoleData = UpdateRoleInput;


// ======================================================
// BASIC GLOBAL ROLE
// ======================================================

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


// ======================================================
// ROLE WITH ORGANIZATION INFORMATION
// ======================================================

export const roleWithOrganizationsSelect = {
    id: true,
    name: true,
    description: true,
    isGlobal: true,

    organizationRoles: {
        select: {
            id: true,

            organization: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },

    createdAt: true,
    updatedAt: true,
} as const;

export type RoleWithOrganizations = Prisma.RoleGetPayload<{
    select: typeof roleWithOrganizationsSelect;
}>;


// ======================================================
// ORGANIZATION ROLE WITH PERMISSIONS
// ======================================================

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