// Study: Read and write database records through Prisma for role templates, organization roles, and permission assignments.
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";

// Study: Import `{ CreateRoleData, OrganizationRole, OrganizationRoleWithPermissions, Role, UpdateRo…` from `"./role.types"`.
import {
    // Study: Bring `CreateRoleData` into scope from the imported module.
    CreateRoleData,
    // Study: Bring `OrganizationRole` into scope from the imported module.
    OrganizationRole,
    // Study: Bring `OrganizationRoleWithPermissions` into scope from the imported module.
    OrganizationRoleWithPermissions,
    // Study: Bring `Role` into scope from the imported module.
    Role,
    // Study: Bring `UpdateRoleData` into scope from the imported module.
    UpdateRoleData,
    // Study: Bring `organizationRoleSelect` into scope from the imported module.
    organizationRoleSelect,
    // Study: Bring `organizationRoleWithPermissionsSelect` into scope from the imported module.
    organizationRoleWithPermissionsSelect,
    // Study: Bring `roleSelect` into scope from the imported module.
    roleSelect,
// Study: Close this group and continue the enclosing expression.
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
// Study: Export `createGlobalRole` as an async function that returns a promise.
export const createGlobalRole = async (
    // Study: Accept `data` with type `CreateRoleData`.
    data: CreateRoleData
// Study: Close this group and continue the enclosing expression.
): Promise<Role> => {
    // Study: Return `await prisma.$transaction(async (tx) => { // Create global role const role = await …` to the caller.
    return await prisma.$transaction(async (tx) => {
        // Create global role
        // Study: Insert a new record through `tx.role` and wait for it to finish and store its result in `role`.
        const role = await tx.role.create({
            // Study: Supply the values to write to the database.
            data: {
                // Study: Set `name` to `data.name`.
                name: data.name,
                // Study: Set `description` to `data.description`.
                description: data.description,
                // Study: Set `isGlobal` to `true`.
                isGlobal: true,
            // Study: Close the object literal.
            },
            // Study: Choose which fields Prisma returns using `roleSelect`.
            select: roleSelect,
        // Study: Close the object literal.
        });

        // Get all organizations
        // Study: Fetch records matching the query through `tx.organization` and wait for it to finish and store its result in `organizations`.
        const organizations = await tx.organization.findMany({
            // Study: Choose which fields Prisma returns.
            select: {
                // Study: Set `id` to `true`.
                id: true,
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        });

        // Create this role for every organization with the provided permissions
        // Study: Run the following branch when `organizations.length > 0` is truthy.
        if (organizations.length > 0) {
            // Study: Iterate over each item from `organizations` using `const organization`.
            for (const organization of organizations) {
                // Study: Insert a new record through `tx.organizationRole` and wait for it to finish.
                await tx.organizationRole.create({
                    // Study: Supply the values to write to the database.
                    data: {
                        // Study: Set the organization identifier used for this record or operation using `organization.id`.
                        organizationId: organization.id,
                        // Study: Set `roleId` to `role.id`.
                        roleId: role.id,
                        // Study: Set `rolePermissions` to `data.permissionIds?.length ? { create: data.permissionIds.map((permissionId) => ({ …`.
                        rolePermissions: data.permissionIds?.length
                            // Study: Use this value when the preceding condition is truthy.
                            ? {
                                  // Study: Set `create` to `data.permissionIds.map((permissionId) => ({ permissionId, }))`.
                                  create: data.permissionIds.map((permissionId) => ({
                                      // Study: Pass the current `permissionId` value under the same property name.
                                      permissionId,
                                  // Study: Close the object literal.
                                  })),
                              // Study: Close the object literal.
                              }
                            // Study: Use this value when the preceding condition is falsy.
                            : undefined,
                    // Study: Close the object literal.
                    },
                // Study: Close the object literal.
                });
            // Study: Close the code block.
            }
        // Study: Close the code block.
        }

        // Study: Return `role` to the caller.
        return role;
    // Study: Close the code block.
    });
// Study: Close the code block.
};

/**
 * Find all global roles.
 */
// Study: Export `findGlobalRoles` as an async function that returns a promise.
export const findGlobalRoles = async (): Promise<Role[]> => {
    // Study: Return `await prisma.role.findMany({ where: { isGlobal: true, }, select: roleSelect, orderB…` to the caller.
    return await prisma.role.findMany({
        // Study: Set the conditions that database records must match using isGlobal.
        where: {
            // Study: Set `isGlobal` to `true`.
            isGlobal: true,
        // Study: Close the object literal.
        },
        // Study: Choose which fields Prisma returns using `roleSelect`.
        select: roleSelect,
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `createdAt` to `"desc"`.
            createdAt: "desc",
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

/**
 * Find a global role by ID.
 */
// Study: Export `findGlobalRoleById` as an async function that returns a promise.
export const findGlobalRoleById = async (
    // Study: Accept `id` with type `string`.
    id: string
// Study: Close this group and continue the enclosing expression.
): Promise<Role | null> => {
    // Study: Return `await prisma.role.findFirst({ where: { id, isGlobal: true, }, select: roleSelect, })` to the caller.
    return await prisma.role.findFirst({
        // Study: Set the conditions that database records must match using id, isGlobal.
        where: {
            // Study: Pass the current `id` value under the same property name.
            id,
            // Study: Set `isGlobal` to `true`.
            isGlobal: true,
        // Study: Close the object literal.
        },
        // Study: Choose which fields Prisma returns using `roleSelect`.
        select: roleSelect,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

/**
 * Find a global role by name.
 */
// Study: Export `findGlobalRoleByName` as an async function that returns a promise.
export const findGlobalRoleByName = async (
    // Study: Accept `name` with type `string`.
    name: string
// Study: Close this group and continue the enclosing expression.
): Promise<Role | null> => {
    // Study: Return `await prisma.role.findFirst({ where: { name, isGlobal: true, }, select: roleSelect, })` to the caller.
    return await prisma.role.findFirst({
        // Study: Set the conditions that database records must match using name, isGlobal.
        where: {
            // Study: Pass the current `name` value under the same property name.
            name,
            // Study: Set `isGlobal` to `true`.
            isGlobal: true,
        // Study: Close the object literal.
        },
        // Study: Choose which fields Prisma returns using `roleSelect`.
        select: roleSelect,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

/**
 * Update a global role.
 */
// Study: Export `updateGlobalRole` as an async function that returns a promise.
export const updateGlobalRole = async (
    // Study: Accept `id` with type `string`.
    id: string,
    // Study: Accept `data` with type `UpdateRoleData`.
    data: UpdateRoleData
// Study: Close this group and continue the enclosing expression.
): Promise<Role> => {
    // Study: Return `await prisma.role.update({ where: { id, }, data: { name: data.name, description: da…` to the caller.
    return await prisma.role.update({
        // Study: Set the conditions that database records must match using id.
        where: {
            // Study: Pass the current `id` value under the same property name.
            id,
        // Study: Close the object literal.
        },
        // Study: Supply the values to write to the database.
        data: {
            // Study: Set `name` to `data.name`.
            name: data.name,
            // Study: Set `description` to `data.description`.
            description: data.description,
        // Study: Close the object literal.
        },
        // Study: Choose which fields Prisma returns using `roleSelect`.
        select: roleSelect,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

/**
 * Delete a global role.
 *
 * OrganizationRole records will be deleted automatically
 * because of the Cascade relation in the Prisma schema.
 */
// Study: Export `deleteGlobalRole` as an async function that returns a promise.
export const deleteGlobalRole = async (
    // Study: Accept `id` with type `string`.
    id: string
// Study: Close this group and continue the enclosing expression.
): Promise<Role> => {
    // Study: Return `await prisma.role.delete({ where: { id, }, select: roleSelect, })` to the caller.
    return await prisma.role.delete({
        // Study: Set the conditions that database records must match using id.
        where: {
            // Study: Pass the current `id` value under the same property name.
            id,
        // Study: Close the object literal.
        },
        // Study: Choose which fields Prisma returns using `roleSelect`.
        select: roleSelect,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

/////////////////////////////////////////////////
// ORGANIZATION ROLE OPERATIONS
/////////////////////////////////////////////////

/**
 * Create an organization-specific role.
 *
 * This is used by ORGANIZATION_OWNER.
 */
// Study: Export `createOrganizationRole` as an async function that returns a promise.
export const createOrganizationRole = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `data` with type `CreateRoleData`.
    data: CreateRoleData
// Study: Close this group and continue the enclosing expression.
): Promise<OrganizationRoleWithPermissions> => {
    // Study: Return `await prisma.$transaction(async (tx) => { const role = await tx.role.create({ data:…` to the caller.
    return await prisma.$transaction(async (tx) => {
        // Study: Insert a new record through `tx.role` and wait for it to finish and store its result in `role`.
        const role = await tx.role.create({
            // Study: Supply the values to write to the database.
            data: {
                // Study: Set `name` to `data.name`.
                name: data.name,
                // Study: Set `description` to `data.description`.
                description: data.description,
                // Study: Set `isGlobal` to `false`.
                isGlobal: false,
                // Study: Pass the current `organizationId` value under the same property name.
                organizationId,
            // Study: Close the object literal.
            }
        // Study: Close the object literal.
        });

        // Study: Return `await tx.organizationRole.create({ data: { organizationId, roleId: role.id, rolePer…` to the caller.
        return await tx.organizationRole.create({
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `organizationId` value under the same property name.
                organizationId,
                // Study: Set `roleId` to `role.id`.
                roleId: role.id,
                // Study: Set `rolePermissions` to `data.permissionIds?.length ? { create: data.permissionIds.map((permissionId) => ({ …`.
                rolePermissions: data.permissionIds?.length
                    // Study: Use this value when the preceding condition is truthy.
                    ? {
                          // Study: Set `create` to `data.permissionIds.map((permissionId) => ({ permissionId, }))`.
                          create: data.permissionIds.map((permissionId) => ({
                              // Study: Pass the current `permissionId` value under the same property name.
                              permissionId,
                          // Study: Close the object literal.
                          })),
                      // Study: Close the object literal.
                      }
                    // Study: Use this value when the preceding condition is falsy.
                    : undefined,
            // Study: Close the object literal.
            },
            // Study: Choose which fields Prisma returns using `organizationRoleWithPermissionsSelect`.
            select: organizationRoleWithPermissionsSelect,
        // Study: Close the object literal.
        });
    // Study: Close the code block.
    });
// Study: Close the code block.
};

/**
 * Find all roles available to an organization.
 *
 * This includes:
 * - Global roles assigned to the organization
 * - Organization-specific roles
 */
// Study: Export `findOrganizationRoles` as an async function that returns a promise.
export const findOrganizationRoles = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
): Promise<OrganizationRole[]> => {
    // Study: Return `await prisma.organizationRole.findMany({ where: { organizationId, }, select: organi…` to the caller.
    return await prisma.organizationRole.findMany({
        // Study: Set the conditions that database records must match using organizationId.
        where: {
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },

        // Study: Choose which fields Prisma returns using `organizationRoleSelect`.
        select: organizationRoleSelect,

        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `createdAt` to `"desc"`.
            createdAt: "desc",
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

/**
 * Find an organization role by ID.
 */
// Study: Export `findOrganizationRoleById` as an async function that returns a promise.
export const findOrganizationRoleById = async (
    // Study: Accept `id` with type `string`.
    id: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
): Promise<OrganizationRole | null> => {
    // Study: Return `await prisma.organizationRole.findFirst({ where: { id, organizationId, }, select: o…` to the caller.
    return await prisma.organizationRole.findFirst({
        // Study: Set the conditions that database records must match using id, organizationId.
        where: {
            // Study: Pass the current `id` value under the same property name.
            id,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },

        // Study: Choose which fields Prisma returns using `organizationRoleSelect`.
        select: organizationRoleSelect,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

/**
 * Find an organization role by ID with permissions.
 */
// Study: Export `findOrganizationRoleByIdWithPermissions` as an async function that returns a promise.
export const findOrganizationRoleByIdWithPermissions = async (
    // Study: Accept `id` with type `string`.
    id: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
): Promise<OrganizationRoleWithPermissions | null> => {
    // Study: Return `await prisma.organizationRole.findFirst({ where: { id, organizationId, }, select: o…` to the caller.
    return await prisma.organizationRole.findFirst({
        // Study: Set the conditions that database records must match using id, organizationId.
        where: {
            // Study: Pass the current `id` value under the same property name.
            id,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },

        // Study: Choose which fields Prisma returns using `organizationRoleWithPermissionsSelect`.
        select: organizationRoleWithPermissionsSelect,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

/**
 * Find an organization's role by role name.
 */
// Study: Export `findOrganizationRoleByName` as an async function that returns a promise.
export const findOrganizationRoleByName = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `name` with type `string`.
    name: string
// Study: Close this group and continue the enclosing expression.
): Promise<OrganizationRole | null> => {
    // Study: Return `await prisma.organizationRole.findFirst({ where: { organizationId, role: { name, },…` to the caller.
    return await prisma.organizationRole.findFirst({
        // Study: Set the conditions that database records must match using organizationId, role.
        where: {
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,

            // Study: Start the nested value for `role`.
            role: {
                // Study: Pass the current `name` value under the same property name.
                name,
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        },

        // Study: Choose which fields Prisma returns using `organizationRoleSelect`.
        select: organizationRoleSelect,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

/**
 * Update an organization role.
 *
 * The role name and description belong to the underlying Role.
 * Permissions belong to the OrganizationRole.
 */
// Study: Export `updateOrganizationRole` as an async function that returns a promise.
export const updateOrganizationRole = async (
    // Study: Accept `id` with type `string`.
    id: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `data` with type `UpdateRoleData`.
    data: UpdateRoleData
// Study: Close this group and continue the enclosing expression.
): Promise<OrganizationRoleWithPermissions> => {
    // Study: Return `await prisma.$transaction(async (tx) => { const organizationRole = await tx.organiz…` to the caller.
    return await prisma.$transaction(async (tx) => {
        // Study: Fetch the first record that matches the filters through `tx.organizationRole` and wait for it to finish and store its result in `organizationRole`.
        const organizationRole = await tx.organizationRole.findFirst({
            // Study: Set the conditions that database records must match using id, organizationId.
            where: {
                // Study: Pass the current `id` value under the same property name.
                id,
                // Study: Pass the current `organizationId` value under the same property name.
                organizationId,
            // Study: Close the object literal.
            },

            // Study: Choose which fields Prisma returns.
            select: {
                // Study: Set `id` to `true`.
                id: true,
                // Study: Set `roleId` to `true`.
                roleId: true,
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        });

        // Study: Run the following branch when `!organizationRole` is truthy.
        if (!organizationRole) {
            // Study: Stop this execution path by throwing `new Error("Organization role not found.")`.
            throw new Error("Organization role not found.");
        // Study: Close the code block.
        }

        // Update role information if provided
        // Study: Run the following branch when `data.name !== undefined || data.description !== undefined` is truthy.
        if (
            // Study: Evaluate `data.name !== undefined || data.description !== undefined`.
            data.name !== undefined ||
            // Study: Evaluate `data.description !== undefined`.
            data.description !== undefined
        // Study: Close this group and continue the enclosing expression.
        ) {
            // Study: Update the uniquely identified record through `tx.role` and wait for it to finish.
            await tx.role.update({
                // Study: Set the conditions that database records must match using id.
                where: {
                    // Study: Set `id` to `organizationRole.roleId`.
                    id: organizationRole.roleId,
                // Study: Close the object literal.
                },

                // Study: Supply the values to write to the database.
                data: {
                    // Study: Expand the values from `(data.name !== undefined && { name: data.name, })` into the surrounding collection.
                    ...(data.name !== undefined && {
                        // Study: Set `name` to `data.name`.
                        name: data.name,
                    // Study: Close the object literal.
                    }),

                    // Study: Expand the values from `(data.description !== undefined && { description: data.description, })` into the surrounding collection.
                    ...(data.description !== undefined && {
                        // Study: Set `description` to `data.description`.
                        description: data.description,
                    // Study: Close the object literal.
                    }),
                // Study: Close the object literal.
                },
            // Study: Close the object literal.
            });
        // Study: Close the code block.
        }

        // Update permissions if provided
        // Study: Run the following branch when `data.permissionIds !== undefined` is truthy.
        if (data.permissionIds !== undefined) {
            // Study: Delete records matching the filters through `tx.rolePermission` and wait for it to finish.
            await tx.rolePermission.deleteMany({
                // Study: Set the conditions that database records must match using organizationRoleId.
                where: {
                    // Study: Set `organizationRoleId` to `id`.
                    organizationRoleId: id,
                // Study: Close the object literal.
                },
            // Study: Close the object literal.
            });

            // Study: Run the following branch when `data.permissionIds.length > 0` is truthy.
            if (data.permissionIds.length > 0) {
                // Study: Insert multiple records through `tx.rolePermission` and wait for it to finish.
                await tx.rolePermission.createMany({
                    // Study: Set `data` to `data.permissionIds.map((permissionId) => ({ organizationRoleId: id, permissionId, }))`.
                    data: data.permissionIds.map((permissionId) => ({
                        // Study: Set `organizationRoleId` to `id`.
                        organizationRoleId: id,
                        // Study: Pass the current `permissionId` value under the same property name.
                        permissionId,
                    // Study: Close the object literal.
                    })),
                // Study: Close the object literal.
                });
            // Study: Close the code block.
            }
        // Study: Close the code block.
        }

        // Study: Return `await tx.organizationRole.findUniqueOrThrow({ where: { id, }, select: organizationR…` to the caller.
        return await tx.organizationRole.findUniqueOrThrow({
            // Study: Set the conditions that database records must match using id.
            where: {
                // Study: Pass the current `id` value under the same property name.
                id,
            // Study: Close the object literal.
            },

            // Study: Choose which fields Prisma returns using `organizationRoleWithPermissionsSelect`.
            select: organizationRoleWithPermissionsSelect,
        // Study: Close the object literal.
        });
    // Study: Close the code block.
    });
// Study: Close the code block.
};

/**
 * Delete an organization role.
 */
// Study: Export `deleteOrganizationRole` as an async function that returns a promise.
export const deleteOrganizationRole = async (
    // Study: Accept `id` with type `string`.
    id: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
): Promise<OrganizationRole> => {
    // Study: Return `await prisma.organizationRole.delete({ where: { id, organizationId, }, select: orga…` to the caller.
    return await prisma.organizationRole.delete({
        // Study: Set the conditions that database records must match using id, organizationId.
        where: {
            // Study: Pass the current `id` value under the same property name.
            id,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },

        // Study: Choose which fields Prisma returns using `organizationRoleSelect`.
        select: organizationRoleSelect,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

/**
 * Count users assigned to an organization role.
 */
// Study: Export `countUsersWithOrganizationRole` as an async function that returns a promise.
export const countUsersWithOrganizationRole = async (
    // Study: Accept `organizationRoleId` with type `string`.
    organizationRoleId: string
// Study: Close this group and continue the enclosing expression.
): Promise<number> => {
    // Study: Return `await prisma.user.count({ where: { organizationRoleId, }, })` to the caller.
    return await prisma.user.count({
        // Study: Set the conditions that database records must match using organizationRoleId.
        where: {
            // Study: Pass the current `organizationRoleId` value under the same property name.
            organizationRoleId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};