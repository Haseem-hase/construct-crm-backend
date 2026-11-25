// Study: Define TypeScript data contracts for role templates, organization roles, and permission assignments.
// Study: Import `{ Prisma }` from `"@prisma/client"`.
import { Prisma } from "@prisma/client";
// Study: Import `{ CreateRoleInput, UpdateRoleInput }` from `"./role.validation"`.
import { CreateRoleInput, UpdateRoleInput } from "./role.validation";

// Create role
// Study: Define the compile-time contract named `CreateRoleData`.
export type CreateRoleData = CreateRoleInput;

// Update role
// Study: Define the compile-time contract named `UpdateRoleData`.
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
// Study: Close this group and continue the enclosing expression.
} as const;

// Study: Define the compile-time contract named `Role`.
export type Role = Prisma.RoleGetPayload<{
    // Study: Define `select` with type `typeof roleSelect`.
    select: typeof roleSelect;
// Study: Close this group and continue the enclosing expression.
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
        // Study: Choose which fields Prisma returns.
        select: {
            // Study: Set `id` to `true`.
            id: true,
            // Study: Set `name` to `true`.
            name: true,
            // Study: Set `description` to `true`.
            description: true,
            // Study: Set `isGlobal` to `true`.
            isGlobal: true,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    },

    // Study: Set `createdAt` to `true`.
    createdAt: true,
    // Study: Set `updatedAt` to `true`.
    updatedAt: true,
// Study: Close this group and continue the enclosing expression.
} as const;

// Study: Define the compile-time contract named `OrganizationRole`.
export type OrganizationRole = Prisma.OrganizationRoleGetPayload<{
    // Study: Define `select` with type `typeof organizationRoleSelect`.
    select: typeof organizationRoleSelect;
// Study: Close this group and continue the enclosing expression.
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
        // Study: Choose which fields Prisma returns.
        select: {
            // Study: Set `id` to `true`.
            id: true,
            // Study: Set `name` to `true`.
            name: true,
            // Study: Set `description` to `true`.
            description: true,
            // Study: Set `isGlobal` to `true`.
            isGlobal: true,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    },

    // Study: Load `rolePermissions` and return its selected fields: permission.
    rolePermissions: {
        // Study: Choose which fields Prisma returns.
        select: {
            // Study: Load `permission` and return its selected fields: id, module, action, description.
            permission: {
                // Study: Choose which fields Prisma returns.
                select: {
                    // Study: Set `id` to `true`.
                    id: true,
                    // Study: Set `module` to `true`.
                    module: true,
                    // Study: Set `action` to `true`.
                    action: true,
                    // Study: Set `description` to `true`.
                    description: true,
                // Study: Close the object literal.
                },
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    },

    // Study: Set `createdAt` to `true`.
    createdAt: true,
    // Study: Set `updatedAt` to `true`.
    updatedAt: true,
// Study: Close this group and continue the enclosing expression.
} as const;

// Study: Define the compile-time contract named `OrganizationRoleWithPermissions`.
export type OrganizationRoleWithPermissions =
    // Study: Supply `Prisma` to the surrounding statement.
    Prisma.OrganizationRoleGetPayload<{
        // Study: Define `select` with type `typeof organizationRoleWithPermissionsSelect`.
        select: typeof organizationRoleWithPermissionsSelect;
    // Study: Close this group and continue the enclosing expression.
    }>;