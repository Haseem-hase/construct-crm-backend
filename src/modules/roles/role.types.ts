// Study: This file is about job roles in each company and the actions people in those roles may take. Lists the names and kinds of information this part of the code expects.
// Study: Bring in `{ Prisma }` from `"@prisma/client"` so this file can use it.
import { Prisma } from "@prisma/client";
// Study: Bring in `{ CreateRoleInput, UpdateRoleInput }` from `"./role.validation"` so this file can use it.
import { CreateRoleInput, UpdateRoleInput } from "./role.validation";

// Create role
// Study: Describe which information `CreateRoleData` can contain so TypeScript can catch mistakes while checking the code.
export type CreateRoleData = CreateRoleInput;

// Update role
// Study: Describe which information `UpdateRoleData` can contain so TypeScript can catch mistakes while checking the code.
export type UpdateRoleData = UpdateRoleInput;

// Basic global Role
// Study: Set `roleSelect` to `{ id: true, name: true, description: true, isGlobal: true, createdAt: true, updated…`.
export const roleSelect = {
    // Study: Set `id` to `true`.
    id: true,
    // Study: Set `name` to `true`.
    name: true,
    // Study: Set `description` to `true`.
    description: true,
    // Study: Set `isGlobal` to `true`.
    isGlobal: true,
    // Study: Set `createdAt` to `true`.
    createdAt: true,
    // Study: Set `updatedAt` to `true`.
    updatedAt: true,
// Study: Finish this group and continue the surrounding step.
} as const;

// Study: Describe which information `Role` can contain so TypeScript can catch mistakes while checking the code.
export type Role = Prisma.RoleGetPayload<{
    // Study: Define `select` with type `typeof roleSelect`.
    select: typeof roleSelect;
// Study: Finish this group and continue the surrounding step.
}>;

// Organization Role with the underlying global role
// Study: Set `organizationRoleSelect` to `{ id: true, organizationId: true, roleId: true, role: { select: { id: true, name: t…`.
export const organizationRoleSelect = {
    // Study: Set `id` to `true`.
    id: true,
    // Study: Set the organization identifier used for this record or operation using `true`.
    organizationId: true,
    // Study: Set `roleId` to `true`.
    roleId: true,

    // Study: Load `role` and return its selected fields: id, name, description, isGlobal.
    role: {
        // Study: Choose which details the database gives back.
        select: {
            // Study: Set `id` to `true`.
            id: true,
            // Study: Set `name` to `true`.
            name: true,
            // Study: Set `description` to `true`.
            description: true,
            // Study: Set `isGlobal` to `true`.
            isGlobal: true,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    },

    // Study: Set `createdAt` to `true`.
    createdAt: true,
    // Study: Set `updatedAt` to `true`.
    updatedAt: true,
// Study: Finish this group and continue the surrounding step.
} as const;

// Study: Describe which information `OrganizationRole` can contain so TypeScript can catch mistakes while checking the code.
export type OrganizationRole = Prisma.OrganizationRoleGetPayload<{
    // Study: Define `select` with type `typeof organizationRoleSelect`.
    select: typeof organizationRoleSelect;
// Study: Finish this group and continue the surrounding step.
}>;

// Organization Role with permissions
// Study: Set `organizationRoleWithPermissionsSelect` to `{ id: true, organizationId: true, roleId: true, role: { select: { id: true, name: t…`.
export const organizationRoleWithPermissionsSelect = {
    // Study: Set `id` to `true`.
    id: true,
    // Study: Set the organization identifier used for this record or operation using `true`.
    organizationId: true,
    // Study: Set `roleId` to `true`.
    roleId: true,

    // Study: Load `role` and return its selected fields: id, name, description, isGlobal.
    role: {
        // Study: Choose which details the database gives back.
        select: {
            // Study: Set `id` to `true`.
            id: true,
            // Study: Set `name` to `true`.
            name: true,
            // Study: Set `description` to `true`.
            description: true,
            // Study: Set `isGlobal` to `true`.
            isGlobal: true,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    },

    // Study: Load `rolePermissions` and return its selected fields: permission.
    rolePermissions: {
        // Study: Choose which details the database gives back.
        select: {
            // Study: Load `permission` and return its selected fields: id, module, action, description.
            permission: {
                // Study: Choose which details the database gives back.
                select: {
                    // Study: Set `id` to `true`.
                    id: true,
                    // Study: Set `module` to `true`.
                    module: true,
                    // Study: Set `action` to `true`.
                    action: true,
                    // Study: Set `description` to `true`.
                    description: true,
                // Study: End this group of values.
                },
            // Study: End this group of values.
            },
        // Study: End this group of values.
        },
    // Study: End this group of values.
    },

    // Study: Set `createdAt` to `true`.
    createdAt: true,
    // Study: Set `updatedAt` to `true`.
    updatedAt: true,
// Study: Finish this group and continue the surrounding step.
} as const;

// Study: Describe which information `OrganizationRoleWithPermissions` can contain so TypeScript can catch mistakes while checking the code.
export type OrganizationRoleWithPermissions =
    // Study: Supply `Prisma` to the surrounding statement.
    Prisma.OrganizationRoleGetPayload<{
        // Study: Define `select` with type `typeof organizationRoleWithPermissionsSelect`.
        select: typeof organizationRoleWithPermissionsSelect;
    // Study: Finish this group and continue the surrounding step.
    }>;