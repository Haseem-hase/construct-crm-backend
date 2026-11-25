// Study: This file is about job roles in each company and the actions people in those roles may take. Finds or saves information in the database, where the CRM keeps its records.
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";

// Study: Bring in `{ CreateRoleData, OrganizationRole, OrganizationRoleWithPermissions, Role, UpdateRo…` from `"./role.types"` so this file can use it.
import {
    // Study: Make `CreateRoleData` from the other file available here.
    CreateRoleData,
    // Study: Make `OrganizationRole` from the other file available here.
    OrganizationRole,
    // Study: Make `OrganizationRoleWithPermissions` from the other file available here.
    OrganizationRoleWithPermissions,
    // Study: Make `Role` from the other file available here.
    Role,
    // Study: Make `UpdateRoleData` from the other file available here.
    UpdateRoleData,
    // Study: Make `organizationRoleSelect` from the other file available here.
    organizationRoleSelect,
    // Study: Make `organizationRoleWithPermissionsSelect` from the other file available here.
    organizationRoleWithPermissionsSelect,
    // Study: Make `roleSelect` from the other file available here.
    roleSelect,
// Study: Finish this group and continue the surrounding step.
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
// Study: Make `createGlobalRole` available to other files. Its result arrives after its work finishes.
export const createGlobalRole = async (
    // Study: This step receives `data`. `CreateRoleData` describes what that information should look like.
    data: CreateRoleData
// Study: Finish this group and continue the surrounding step.
): Promise<Role> => {
    // Study: Give `await prisma.$transaction(async (tx) => { // Create global role const role = await …` back to the code that asked for it.
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
            // Study: End this group of values.
            },
            // Study: Choose which details the database gives back using `roleSelect`.
            select: roleSelect,
        // Study: End this group of values.
        });

        // Get all organizations
        // Study: Find all matching records using `tx.organization` and wait for it to finish and store its result in `organizations`.
        const organizations = await tx.organization.findMany({
            // Study: Choose which details the database gives back.
            select: {
                // Study: Set `id` to `true`.
                id: true,
            // Study: End this group of values.
            },
        // Study: End this group of values.
        });

        // Create this role for every organization with the provided permissions
        // Study: Do the next step if this check passes: `organizations.length > 0`.
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
                            // Study: Use this value if the check above passes.
                            ? {
                                  // Study: Set `create` to `data.permissionIds.map((permissionId) => ({ permissionId, }))`.
                                  create: data.permissionIds.map((permissionId) => ({
                                      // Study: Carry the value of `permissionId` into the new group under the same name.
                                      permissionId,
                                  // Study: End this group of values.
                                  })),
                              // Study: End this group of values.
                              }
                            // Study: Use this value if the check above fails.
                            : undefined,
                    // Study: End this group of values.
                    },
                // Study: End this group of values.
                });
            // Study: End this group of steps.
            }
        // Study: End this group of steps.
        }

        // Study: Give `role` back to the code that asked for it.
        return role;
    // Study: End this group of steps.
    });
// Study: End this group of steps.
};

/**
 * Find all global roles.
 */
// Study: Make `findGlobalRoles` available to other files. Its result arrives after its work finishes.
export const findGlobalRoles = async (): Promise<Role[]> => {
    // Study: Give `await prisma.role.findMany({ where: { isGlobal: true, }, select: roleSelect, orderB…` back to the code that asked for it.
    return await prisma.role.findMany({
        // Study: Set the conditions that records must meet using isGlobal.
        where: {
            // Study: Set `isGlobal` to `true`.
            isGlobal: true,
        // Study: End this group of values.
        },
        // Study: Choose which details the database gives back using `roleSelect`.
        select: roleSelect,
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `createdAt` to `"desc"`.
            createdAt: "desc",
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

/**
 * Find a global role by ID.
 */
// Study: Make `findGlobalRoleById` available to other files. Its result arrives after its work finishes.
export const findGlobalRoleById = async (
    // Study: This step receives `id`. `string` describes what that information should look like.
    id: string
// Study: Finish this group and continue the surrounding step.
): Promise<Role | null> => {
    // Study: Give `await prisma.role.findFirst({ where: { id, isGlobal: true, }, select: roleSelect, })` back to the code that asked for it.
    return await prisma.role.findFirst({
        // Study: Set the conditions that records must meet using id, isGlobal.
        where: {
            // Study: Carry the value of `id` into the new group under the same name.
            id,
            // Study: Set `isGlobal` to `true`.
            isGlobal: true,
        // Study: End this group of values.
        },
        // Study: Choose which details the database gives back using `roleSelect`.
        select: roleSelect,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

/**
 * Find a global role by name.
 */
// Study: Make `findGlobalRoleByName` available to other files. Its result arrives after its work finishes.
export const findGlobalRoleByName = async (
    // Study: This step receives `name`. `string` describes what that information should look like.
    name: string
// Study: Finish this group and continue the surrounding step.
): Promise<Role | null> => {
    // Study: Give `await prisma.role.findFirst({ where: { name, isGlobal: true, }, select: roleSelect, })` back to the code that asked for it.
    return await prisma.role.findFirst({
        // Study: Set the conditions that records must meet using name, isGlobal.
        where: {
            // Study: Carry the value of `name` into the new group under the same name.
            name,
            // Study: Set `isGlobal` to `true`.
            isGlobal: true,
        // Study: End this group of values.
        },
        // Study: Choose which details the database gives back using `roleSelect`.
        select: roleSelect,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

/**
 * Update a global role.
 */
// Study: Make `updateGlobalRole` available to other files. Its result arrives after its work finishes.
export const updateGlobalRole = async (
    // Study: This step receives `id`. `string` describes what that information should look like.
    id: string,
    // Study: This step receives `data`. `UpdateRoleData` describes what that information should look like.
    data: UpdateRoleData
// Study: Finish this group and continue the surrounding step.
): Promise<Role> => {
    // Study: Give `await prisma.role.update({ where: { id, }, data: { name: data.name, description: da…` back to the code that asked for it.
    return await prisma.role.update({
        // Study: Set the conditions that records must meet using id.
        where: {
            // Study: Carry the value of `id` into the new group under the same name.
            id,
        // Study: End this group of values.
        },
        // Study: Supply the values to write to the database.
        data: {
            // Study: Set `name` to `data.name`.
            name: data.name,
            // Study: Set `description` to `data.description`.
            description: data.description,
        // Study: End this group of values.
        },
        // Study: Choose which details the database gives back using `roleSelect`.
        select: roleSelect,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

/**
 * Delete a global role.
 *
 * OrganizationRole records will be deleted automatically
 * because of the Cascade relation in the Prisma schema.
 */
// Study: Make `deleteGlobalRole` available to other files. Its result arrives after its work finishes.
export const deleteGlobalRole = async (
    // Study: This step receives `id`. `string` describes what that information should look like.
    id: string
// Study: Finish this group and continue the surrounding step.
): Promise<Role> => {
    // Study: Give `await prisma.role.delete({ where: { id, }, select: roleSelect, })` back to the code that asked for it.
    return await prisma.role.delete({
        // Study: Set the conditions that records must meet using id.
        where: {
            // Study: Carry the value of `id` into the new group under the same name.
            id,
        // Study: End this group of values.
        },
        // Study: Choose which details the database gives back using `roleSelect`.
        select: roleSelect,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

/////////////////////////////////////////////////
// ORGANIZATION ROLE OPERATIONS
/////////////////////////////////////////////////

/**
 * Create an organization-specific role.
 *
 * This is used by ORGANIZATION_OWNER.
 */
// Study: Make `createOrganizationRole` available to other files. Its result arrives after its work finishes.
export const createOrganizationRole = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `data`. `CreateRoleData` describes what that information should look like.
    data: CreateRoleData
// Study: Finish this group and continue the surrounding step.
): Promise<OrganizationRoleWithPermissions> => {
    // Study: Give `await prisma.$transaction(async (tx) => { const role = await tx.role.create({ data:…` back to the code that asked for it.
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
                // Study: Carry the value of `organizationId` into the new group under the same name.
                organizationId,
            // Study: End this group of values.
            }
        // Study: End this group of values.
        });

        // Study: Give `await tx.organizationRole.create({ data: { organizationId, roleId: role.id, rolePer…` back to the code that asked for it.
        return await tx.organizationRole.create({
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `organizationId` into the new group under the same name.
                organizationId,
                // Study: Set `roleId` to `role.id`.
                roleId: role.id,
                // Study: Set `rolePermissions` to `data.permissionIds?.length ? { create: data.permissionIds.map((permissionId) => ({ …`.
                rolePermissions: data.permissionIds?.length
                    // Study: Use this value if the check above passes.
                    ? {
                          // Study: Set `create` to `data.permissionIds.map((permissionId) => ({ permissionId, }))`.
                          create: data.permissionIds.map((permissionId) => ({
                              // Study: Carry the value of `permissionId` into the new group under the same name.
                              permissionId,
                          // Study: End this group of values.
                          })),
                      // Study: End this group of values.
                      }
                    // Study: Use this value if the check above fails.
                    : undefined,
            // Study: End this group of values.
            },
            // Study: Choose which details the database gives back using `organizationRoleWithPermissionsSelect`.
            select: organizationRoleWithPermissionsSelect,
        // Study: End this group of values.
        });
    // Study: End this group of steps.
    });
// Study: End this group of steps.
};

/**
 * Find all roles available to an organization.
 *
 * This includes:
 * - Global roles assigned to the organization
 * - Organization-specific roles
 */
// Study: Make `findOrganizationRoles` available to other files. Its result arrives after its work finishes.
export const findOrganizationRoles = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
): Promise<OrganizationRole[]> => {
    // Study: Give `await prisma.organizationRole.findMany({ where: { organizationId, }, select: organi…` back to the code that asked for it.
    return await prisma.organizationRole.findMany({
        // Study: Set the conditions that records must meet using organizationId.
        where: {
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },

        // Study: Choose which details the database gives back using `organizationRoleSelect`.
        select: organizationRoleSelect,

        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `createdAt` to `"desc"`.
            createdAt: "desc",
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

/**
 * Find an organization role by ID.
 */
// Study: Make `findOrganizationRoleById` available to other files. Its result arrives after its work finishes.
export const findOrganizationRoleById = async (
    // Study: This step receives `id`. `string` describes what that information should look like.
    id: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
): Promise<OrganizationRole | null> => {
    // Study: Give `await prisma.organizationRole.findFirst({ where: { id, organizationId, }, select: o…` back to the code that asked for it.
    return await prisma.organizationRole.findFirst({
        // Study: Set the conditions that records must meet using id, organizationId.
        where: {
            // Study: Carry the value of `id` into the new group under the same name.
            id,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },

        // Study: Choose which details the database gives back using `organizationRoleSelect`.
        select: organizationRoleSelect,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

/**
 * Find an organization role by ID with permissions.
 */
// Study: Make `findOrganizationRoleByIdWithPermissions` available to other files. Its result arrives after its work finishes.
export const findOrganizationRoleByIdWithPermissions = async (
    // Study: This step receives `id`. `string` describes what that information should look like.
    id: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
): Promise<OrganizationRoleWithPermissions | null> => {
    // Study: Give `await prisma.organizationRole.findFirst({ where: { id, organizationId, }, select: o…` back to the code that asked for it.
    return await prisma.organizationRole.findFirst({
        // Study: Set the conditions that records must meet using id, organizationId.
        where: {
            // Study: Carry the value of `id` into the new group under the same name.
            id,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },

        // Study: Choose which details the database gives back using `organizationRoleWithPermissionsSelect`.
        select: organizationRoleWithPermissionsSelect,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

/**
 * Find an organization's role by role name.
 */
// Study: Make `findOrganizationRoleByName` available to other files. Its result arrives after its work finishes.
export const findOrganizationRoleByName = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `name`. `string` describes what that information should look like.
    name: string
// Study: Finish this group and continue the surrounding step.
): Promise<OrganizationRole | null> => {
    // Study: Give `await prisma.organizationRole.findFirst({ where: { organizationId, role: { name, },…` back to the code that asked for it.
    return await prisma.organizationRole.findFirst({
        // Study: Set the conditions that records must meet using organizationId, role.
        where: {
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,

            // Study: Start the nested value for `role`.
            role: {
                // Study: Carry the value of `name` into the new group under the same name.
                name,
            // Study: End this group of values.
            },
        // Study: End this group of values.
        },

        // Study: Choose which details the database gives back using `organizationRoleSelect`.
        select: organizationRoleSelect,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

/**
 * Update an organization role.
 *
 * The role name and description belong to the underlying Role.
 * Permissions belong to the OrganizationRole.
 */
// Study: Make `updateOrganizationRole` available to other files. Its result arrives after its work finishes.
export const updateOrganizationRole = async (
    // Study: This step receives `id`. `string` describes what that information should look like.
    id: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `data`. `UpdateRoleData` describes what that information should look like.
    data: UpdateRoleData
// Study: Finish this group and continue the surrounding step.
): Promise<OrganizationRoleWithPermissions> => {
    // Study: Give `await prisma.$transaction(async (tx) => { const organizationRole = await tx.organiz…` back to the code that asked for it.
    return await prisma.$transaction(async (tx) => {
        // Study: Find the first record that meets these checks using `tx.organizationRole` and wait for it to finish and store its result in `organizationRole`.
        const organizationRole = await tx.organizationRole.findFirst({
            // Study: Set the conditions that records must meet using id, organizationId.
            where: {
                // Study: Carry the value of `id` into the new group under the same name.
                id,
                // Study: Carry the value of `organizationId` into the new group under the same name.
                organizationId,
            // Study: End this group of values.
            },

            // Study: Choose which details the database gives back.
            select: {
                // Study: Set `id` to `true`.
                id: true,
                // Study: Set `roleId` to `true`.
                roleId: true,
            // Study: End this group of values.
            },
        // Study: End this group of values.
        });

        // Study: Do the next step if there is no value for `organizationRole`.
        if (!organizationRole) {
            // Study: Stop here and report this problem: "Organization role not found."
            throw new Error("Organization role not found.");
        // Study: End this group of steps.
        }

        // Update role information if provided
        // Study: Do the next step if this check passes: `data.name !== undefined || data.description !== undefined`.
        if (
            // Study: Evaluate `data.name !== undefined || data.description !== undefined`.
            data.name !== undefined ||
            // Study: Evaluate `data.description !== undefined`.
            data.description !== undefined
        // Study: Finish this group and continue the surrounding step.
        ) {
            // Study: Update the uniquely identified record through `tx.role` and wait for it to finish.
            await tx.role.update({
                // Study: Set the conditions that records must meet using id.
                where: {
                    // Study: Set `id` to `organizationRole.roleId`.
                    id: organizationRole.roleId,
                // Study: End this group of values.
                },

                // Study: Supply the values to write to the database.
                data: {
                    // Study: Expand the values from `(data.name !== undefined && { name: data.name, })` into the surrounding collection.
                    ...(data.name !== undefined && {
                        // Study: Set `name` to `data.name`.
                        name: data.name,
                    // Study: End this group of values.
                    }),

                    // Study: Expand the values from `(data.description !== undefined && { description: data.description, })` into the surrounding collection.
                    ...(data.description !== undefined && {
                        // Study: Set `description` to `data.description`.
                        description: data.description,
                    // Study: End this group of values.
                    }),
                // Study: End this group of values.
                },
            // Study: End this group of values.
            });
        // Study: End this group of steps.
        }

        // Update permissions if provided
        // Study: Do the next step if this check passes: `data.permissionIds !== undefined`.
        if (data.permissionIds !== undefined) {
            // Study: Delete records matching the filters through `tx.rolePermission` and wait for it to finish.
            await tx.rolePermission.deleteMany({
                // Study: Set the conditions that records must meet using organizationRoleId.
                where: {
                    // Study: Set `organizationRoleId` to `id`.
                    organizationRoleId: id,
                // Study: End this group of values.
                },
            // Study: End this group of values.
            });

            // Study: Do the next step if this check passes: `data.permissionIds.length > 0`.
            if (data.permissionIds.length > 0) {
                // Study: Insert multiple records through `tx.rolePermission` and wait for it to finish.
                await tx.rolePermission.createMany({
                    // Study: Set `data` to `data.permissionIds.map((permissionId) => ({ organizationRoleId: id, permissionId, }))`.
                    data: data.permissionIds.map((permissionId) => ({
                        // Study: Set `organizationRoleId` to `id`.
                        organizationRoleId: id,
                        // Study: Carry the value of `permissionId` into the new group under the same name.
                        permissionId,
                    // Study: End this group of values.
                    })),
                // Study: End this group of values.
                });
            // Study: End this group of steps.
            }
        // Study: End this group of steps.
        }

        // Study: Give `await tx.organizationRole.findUniqueOrThrow({ where: { id, }, select: organizationR…` back to the code that asked for it.
        return await tx.organizationRole.findUniqueOrThrow({
            // Study: Set the conditions that records must meet using id.
            where: {
                // Study: Carry the value of `id` into the new group under the same name.
                id,
            // Study: End this group of values.
            },

            // Study: Choose which details the database gives back using `organizationRoleWithPermissionsSelect`.
            select: organizationRoleWithPermissionsSelect,
        // Study: End this group of values.
        });
    // Study: End this group of steps.
    });
// Study: End this group of steps.
};

/**
 * Delete an organization role.
 */
// Study: Make `deleteOrganizationRole` available to other files. Its result arrives after its work finishes.
export const deleteOrganizationRole = async (
    // Study: This step receives `id`. `string` describes what that information should look like.
    id: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
): Promise<OrganizationRole> => {
    // Study: Give `await prisma.organizationRole.delete({ where: { id, organizationId, }, select: orga…` back to the code that asked for it.
    return await prisma.organizationRole.delete({
        // Study: Set the conditions that records must meet using id, organizationId.
        where: {
            // Study: Carry the value of `id` into the new group under the same name.
            id,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },

        // Study: Choose which details the database gives back using `organizationRoleSelect`.
        select: organizationRoleSelect,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

/**
 * Count users assigned to an organization role.
 */
// Study: Make `countUsersWithOrganizationRole` available to other files. Its result arrives after its work finishes.
export const countUsersWithOrganizationRole = async (
    // Study: This step receives `organizationRoleId`. `string` describes what that information should look like.
    organizationRoleId: string
// Study: Finish this group and continue the surrounding step.
): Promise<number> => {
    // Study: Give `await prisma.user.count({ where: { organizationRoleId, }, })` back to the code that asked for it.
    return await prisma.user.count({
        // Study: Set the conditions that records must meet using organizationRoleId.
        where: {
            // Study: Carry the value of `organizationRoleId` into the new group under the same name.
            organizationRoleId,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};