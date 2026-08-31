import { Prisma } from "@prisma/client";

import { CreateRoleInput, UpdateRoleInput } from "./role.validation";

//create role
export type CreateRoleData = CreateRoleInput;

//update role
export type UpdateRoleData = UpdateRoleInput;

//role with its permissions
export const roleWithPermissionsSelect = {
    id: true,
    name: true,
    description: true,
    organizationId: true,

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

export type RoleWithPermissions = Prisma.RoleGetPayload<{
    select: typeof roleWithPermissionsSelect;
}>;

//basuc role
export const roleSelect = {
    id: true,
    name: true,
    description: true,
    organizationId: true,
    createdAt: true,
    updatedAt: true,
} as const;

export type Role = Prisma.RoleGetPayload<{
    select: typeof roleSelect;
}>;



