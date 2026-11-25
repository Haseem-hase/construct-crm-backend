// Study: Apply business rules and coordinate database operations for role templates, organization roles, and permission assignments.
// Study: Import `{ BadRequestError }` from `"../../errors/BadRequestError"`.
import { BadRequestError } from "../../errors/BadRequestError";
// Study: Import `{ ForbiddenError }` from `"../../errors/ForbiddenError"`.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Import `{ NotFoundError }` from `"../../errors/NotFoundError"`.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Import `{ countUsersWithOrganizationRole, createGlobalRole, createOrganizationRole, deleteG…` from `"./role.repository"`.
import { 
    // Study: Bring `countUsersWithOrganizationRole` into scope from the imported module.
    countUsersWithOrganizationRole, 
    // Study: Bring `createGlobalRole` into scope from the imported module.
    createGlobalRole, 
    // Study: Bring `createOrganizationRole` into scope from the imported module.
    createOrganizationRole, 
    // Study: Bring `deleteGlobalRole` into scope from the imported module.
    deleteGlobalRole, 
    // Study: Bring `deleteOrganizationRole` into scope from the imported module.
    deleteOrganizationRole, 
    // Study: Bring `findGlobalRoleById` into scope from the imported module.
    findGlobalRoleById, 
    // Study: Bring `findGlobalRoleByName` into scope from the imported module.
    findGlobalRoleByName, 
    // Study: Bring `findGlobalRoles` into scope from the imported module.
    findGlobalRoles, 
    // Study: Bring `findOrganizationRoleById` into scope from the imported module.
    findOrganizationRoleById, 
    // Study: Bring `findOrganizationRoleByIdWithPermissions` into scope from the imported module.
    findOrganizationRoleByIdWithPermissions, 
    // Study: Bring `findOrganizationRoleByName` into scope from the imported module.
    findOrganizationRoleByName, 
    // Study: Bring `findOrganizationRoles` into scope from the imported module.
    findOrganizationRoles, 
    // Study: Bring `updateGlobalRole` into scope from the imported module.
    updateGlobalRole, 
    // Study: Bring `updateOrganizationRole` into scope from the imported module.
    updateOrganizationRole 
// Study: Close this group and continue the enclosing expression.
} from "./role.repository";
// Study: Import `{ CreateRoleData, UpdateRoleData }` from `"./role.types"`.
import { CreateRoleData, UpdateRoleData } from "./role.types";

// ==========================================
// GLOBAL ROLE SERVICES (SUPER_ADMIN)
// ==========================================

// Study: Export `createGlobalRoleService` as an async function that returns a promise.
export const createGlobalRoleService = async (data: CreateRoleData) => {
    // Study: Call `findGlobalRoleByName` and wait for it to finish and store its result in `existingRole`.
    const existingRole = await findGlobalRoleByName(data.name);
    // Study: Run the following branch when `existingRole` is truthy.
    if (existingRole) {
        // Study: Stop this execution path by throwing `new BadRequestError("A global role with this name already exists.")`.
        throw new BadRequestError("A global role with this name already exists.");
    // Study: Close the code block.
    }
    // Study: Return `await createGlobalRole(data)` to the caller.
    return await createGlobalRole(data);
// Study: Close the code block.
};

// Study: Export `getGlobalRolesService` as an async function that returns a promise.
export const getGlobalRolesService = async () => {
    // Study: Return `await findGlobalRoles()` to the caller.
    return await findGlobalRoles();
// Study: Close the code block.
};

// Study: Export `getGlobalRoleService` as an async function that returns a promise.
export const getGlobalRoleService = async (roleId: string) => {
    // Study: Call `findGlobalRoleById` and wait for it to finish and store its result in `role`.
    const role = await findGlobalRoleById(roleId);
    // Study: Run the following branch when `!role` is truthy.
    if (!role) {
        // Study: Stop this execution path by throwing `new NotFoundError("Global role not found.")`.
        throw new NotFoundError("Global role not found.");
    // Study: Close the code block.
    }
    // Study: Return `role` to the caller.
    return role;
// Study: Close the code block.
};

// Study: Export `updateGlobalRoleService` as an async function that returns a promise.
export const updateGlobalRoleService = async (roleId: string, data: UpdateRoleData) => {
    // Study: Call `findGlobalRoleById` and wait for it to finish and store its result in `role`.
    const role = await findGlobalRoleById(roleId);
    // Study: Run the following branch when `!role` is truthy.
    if (!role) {
        // Study: Stop this execution path by throwing `new NotFoundError("Global role not found.")`.
        throw new NotFoundError("Global role not found.");
    // Study: Close the code block.
    }

    // Study: Run the following branch when `data.name && data.name !== role.name` is truthy.
    if (data.name && data.name !== role.name) {
        // Study: Call `findGlobalRoleByName` and wait for it to finish and store its result in `existingRole`.
        const existingRole = await findGlobalRoleByName(data.name);
        // Study: Run the following branch when `existingRole` is truthy.
        if (existingRole) {
            // Study: Stop this execution path by throwing `new BadRequestError("A global role with this name already exists.")`.
            throw new BadRequestError("A global role with this name already exists.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Study: Return `await updateGlobalRole(roleId, data)` to the caller.
    return await updateGlobalRole(roleId, data);
// Study: Close the code block.
};

// Study: Export `deleteGlobalRoleService` as an async function that returns a promise.
export const deleteGlobalRoleService = async (roleId: string) => {
    // Study: Call `findGlobalRoleById` and wait for it to finish and store its result in `role`.
    const role = await findGlobalRoleById(roleId);
    // Study: Run the following branch when `!role` is truthy.
    if (!role) {
        // Study: Stop this execution path by throwing `new NotFoundError("Global role not found.")`.
        throw new NotFoundError("Global role not found.");
    // Study: Close the code block.
    }
    // Study: Return `await deleteGlobalRole(roleId)` to the caller.
    return await deleteGlobalRole(roleId);
// Study: Close the code block.
};


// ==========================================
// ORGANIZATION ROLE SERVICES (ORGANIZATION_OWNER)
// ==========================================

// Study: Export `createOrganizationRoleService` as an async function that returns a promise.
export const createOrganizationRoleService = async (organizationId: string, data: CreateRoleData) => {
    // Study: Call `findOrganizationRoleByName` and wait for it to finish and store its result in `existingRole`.
    const existingRole = await findOrganizationRoleByName(organizationId, data.name);
    // Study: Run the following branch when `existingRole` is truthy.
    if (existingRole) {
        // Study: Stop this execution path by throwing `new BadRequestError("A role with this name already exists in your organization.")`.
        throw new BadRequestError("A role with this name already exists in your organization.");
    // Study: Close the code block.
    }
    // Study: Return `await createOrganizationRole(organizationId, data)` to the caller.
    return await createOrganizationRole(organizationId, data);
// Study: Close the code block.
};

// Study: Export `getOrganizationRolesService` as an async function that returns a promise.
export const getOrganizationRolesService = async (organizationId: string) => {
    // Study: Return `await findOrganizationRoles(organizationId)` to the caller.
    return await findOrganizationRoles(organizationId);
// Study: Close the code block.
};

// Study: Export `getOrganizationRoleService` as an async function that returns a promise.
export const getOrganizationRoleService = async (id: string, organizationId: string) => {
    // Study: Call `findOrganizationRoleByIdWithPermissions` and wait for it to finish and store its result in `role`.
    const role = await findOrganizationRoleByIdWithPermissions(id, organizationId);
    // Study: Run the following branch when `!role` is truthy.
    if (!role) {
        // Study: Stop this execution path by throwing `new NotFoundError("Role not found.")`.
        throw new NotFoundError("Role not found.");
    // Study: Close the code block.
    }
    // Study: Return `role` to the caller.
    return role;
// Study: Close the code block.
};

// Study: Export `updateOrganizationRoleService` as an async function that returns a promise.
export const updateOrganizationRoleService = async (id: string, organizationId: string, data: UpdateRoleData) => {
    // Study: Call `findOrganizationRoleById` and wait for it to finish and store its result in `organizationRole`.
    const organizationRole = await findOrganizationRoleById(id, organizationId);
    
    // Study: Run the following branch when `!organizationRole` is truthy.
    if (!organizationRole) {
        // Study: Stop this execution path by throwing `new NotFoundError("Role not found.")`.
        throw new NotFoundError("Role not found.");
    // Study: Close the code block.
    }

    // Do not allow changing name or description of a GLOBAL role.
    // Study: Run the following branch when `organizationRole.role.isGlobal` is truthy.
    if (organizationRole.role.isGlobal) {
        // Study: Run the following branch when `data.name !== undefined || data.description !== undefined` is truthy.
        if (data.name !== undefined || data.description !== undefined) {
            // Study: Stop this execution path by throwing `new ForbiddenError("You cannot modify the name or description of a global role.")`.
            throw new ForbiddenError("You cannot modify the name or description of a global role.");
        // Study: Close the code block.
        }
    // Study: Run this branch if the preceding conditions failed.
    } else {
        // For custom roles, make sure name doesn't conflict
        // Study: Run the following branch when `data.name && data.name !== organizationRole.role.name` is truthy.
        if (data.name && data.name !== organizationRole.role.name) {
            // Study: Call `findOrganizationRoleByName` and wait for it to finish and store its result in `existingRole`.
            const existingRole = await findOrganizationRoleByName(organizationId, data.name);
            // Study: Run the following branch when `existingRole` is truthy.
            if (existingRole) {
                // Study: Stop this execution path by throwing `new BadRequestError("A role with this name already exists in your organization.")`.
                throw new BadRequestError("A role with this name already exists in your organization.");
            // Study: Close the code block.
            }
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Study: Return `await updateOrganizationRole(id, organizationId, data)` to the caller.
    return await updateOrganizationRole(id, organizationId, data);
// Study: Close the code block.
};

// Study: Export `deleteOrganizationRoleService` as an async function that returns a promise.
export const deleteOrganizationRoleService = async (id: string, organizationId: string) => {
    // Study: Call `findOrganizationRoleById` and wait for it to finish and store its result in `organizationRole`.
    const organizationRole = await findOrganizationRoleById(id, organizationId);
    
    // Study: Run the following branch when `!organizationRole` is truthy.
    if (!organizationRole) {
        // Study: Stop this execution path by throwing `new NotFoundError("Role not found.")`.
        throw new NotFoundError("Role not found.");
    // Study: Close the code block.
    }

    // Study: Run the following branch when `organizationRole.role.isGlobal` is truthy.
    if (organizationRole.role.isGlobal) {
        // Study: Stop this execution path by throwing `new ForbiddenError("You cannot delete a global role from your organization.")`.
        throw new ForbiddenError("You cannot delete a global role from your organization.");
    // Study: Close the code block.
    }

    // Study: Call `countUsersWithOrganizationRole` and wait for it to finish and store its result in `userCount`.
    const userCount = await countUsersWithOrganizationRole(id);
    // Study: Run the following branch when `userCount > 0` is truthy.
    if (userCount > 0) {
        // Study: Stop this execution path by throwing `new BadRequestError("This role cannot be deleted because it is assigned to users.")`.
        throw new BadRequestError("This role cannot be deleted because it is assigned to users.");
    // Study: Close the code block.
    }

    // Study: Return `await deleteOrganizationRole(id, organizationId)` to the caller.
    return await deleteOrganizationRole(id, organizationId);
// Study: Close the code block.
};