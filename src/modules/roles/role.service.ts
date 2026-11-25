// Study: This file is about job roles in each company and the actions people in those roles may take. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `{ BadRequestError }` from `"../../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../../errors/BadRequestError";
// Study: Bring in `{ ForbiddenError }` from `"../../errors/ForbiddenError"` so this file can use it.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Bring in `{ NotFoundError }` from `"../../errors/NotFoundError"` so this file can use it.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Bring in `{ countUsersWithOrganizationRole, createGlobalRole, createOrganizationRole, deleteG…` from `"./role.repository"` so this file can use it.
import { 
    // Study: Make `countUsersWithOrganizationRole` from the other file available here.
    countUsersWithOrganizationRole, 
    // Study: Make `createGlobalRole` from the other file available here.
    createGlobalRole, 
    // Study: Make `createOrganizationRole` from the other file available here.
    createOrganizationRole, 
    // Study: Make `deleteGlobalRole` from the other file available here.
    deleteGlobalRole, 
    // Study: Make `deleteOrganizationRole` from the other file available here.
    deleteOrganizationRole, 
    // Study: Make `findGlobalRoleById` from the other file available here.
    findGlobalRoleById, 
    // Study: Make `findGlobalRoleByName` from the other file available here.
    findGlobalRoleByName, 
    // Study: Make `findGlobalRoles` from the other file available here.
    findGlobalRoles, 
    // Study: Make `findOrganizationRoleById` from the other file available here.
    findOrganizationRoleById, 
    // Study: Make `findOrganizationRoleByIdWithPermissions` from the other file available here.
    findOrganizationRoleByIdWithPermissions, 
    // Study: Make `findOrganizationRoleByName` from the other file available here.
    findOrganizationRoleByName, 
    // Study: Make `findOrganizationRoles` from the other file available here.
    findOrganizationRoles, 
    // Study: Make `updateGlobalRole` from the other file available here.
    updateGlobalRole, 
    // Study: Make `updateOrganizationRole` from the other file available here.
    updateOrganizationRole 
// Study: Finish this group and continue the surrounding step.
} from "./role.repository";
// Study: Bring in `{ CreateRoleData, UpdateRoleData }` from `"./role.types"` so this file can use it.
import { CreateRoleData, UpdateRoleData } from "./role.types";

// ==========================================
// GLOBAL ROLE SERVICES (SUPER_ADMIN)
// ==========================================

// Study: Make `createGlobalRoleService` available to other files. Its result arrives after its work finishes.
export const createGlobalRoleService = async (data: CreateRoleData) => {
    // Study: Call `findGlobalRoleByName` and wait for it to finish and store its result in `existingRole`.
    const existingRole = await findGlobalRoleByName(data.name);
    // Study: Do the next step if this check passes: `existingRole`.
    if (existingRole) {
        // Study: Stop here and report this problem: "A global role with this name already exists."
        throw new BadRequestError("A global role with this name already exists.");
    // Study: End this group of steps.
    }
    // Study: Give `await createGlobalRole(data)` back to the code that asked for it.
    return await createGlobalRole(data);
// Study: End this group of steps.
};

// Study: Make `getGlobalRolesService` available to other files. Its result arrives after its work finishes.
export const getGlobalRolesService = async () => {
    // Study: Give `await findGlobalRoles()` back to the code that asked for it.
    return await findGlobalRoles();
// Study: End this group of steps.
};

// Study: Make `getGlobalRoleService` available to other files. Its result arrives after its work finishes.
export const getGlobalRoleService = async (roleId: string) => {
    // Study: Call `findGlobalRoleById` and wait for it to finish and store its result in `role`.
    const role = await findGlobalRoleById(roleId);
    // Study: Do the next step if there is no value for `role`.
    if (!role) {
        // Study: Stop here and report this problem: "Global role not found."
        throw new NotFoundError("Global role not found.");
    // Study: End this group of steps.
    }
    // Study: Give `role` back to the code that asked for it.
    return role;
// Study: End this group of steps.
};

// Study: Make `updateGlobalRoleService` available to other files. Its result arrives after its work finishes.
export const updateGlobalRoleService = async (roleId: string, data: UpdateRoleData) => {
    // Study: Call `findGlobalRoleById` and wait for it to finish and store its result in `role`.
    const role = await findGlobalRoleById(roleId);
    // Study: Do the next step if there is no value for `role`.
    if (!role) {
        // Study: Stop here and report this problem: "Global role not found."
        throw new NotFoundError("Global role not found.");
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `data.name && data.name !== role.name`.
    if (data.name && data.name !== role.name) {
        // Study: Call `findGlobalRoleByName` and wait for it to finish and store its result in `existingRole`.
        const existingRole = await findGlobalRoleByName(data.name);
        // Study: Do the next step if this check passes: `existingRole`.
        if (existingRole) {
            // Study: Stop here and report this problem: "A global role with this name already exists."
            throw new BadRequestError("A global role with this name already exists.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Study: Give `await updateGlobalRole(roleId, data)` back to the code that asked for it.
    return await updateGlobalRole(roleId, data);
// Study: End this group of steps.
};

// Study: Make `deleteGlobalRoleService` available to other files. Its result arrives after its work finishes.
export const deleteGlobalRoleService = async (roleId: string) => {
    // Study: Call `findGlobalRoleById` and wait for it to finish and store its result in `role`.
    const role = await findGlobalRoleById(roleId);
    // Study: Do the next step if there is no value for `role`.
    if (!role) {
        // Study: Stop here and report this problem: "Global role not found."
        throw new NotFoundError("Global role not found.");
    // Study: End this group of steps.
    }
    // Study: Give `await deleteGlobalRole(roleId)` back to the code that asked for it.
    return await deleteGlobalRole(roleId);
// Study: End this group of steps.
};


// ==========================================
// ORGANIZATION ROLE SERVICES (ORGANIZATION_OWNER)
// ==========================================

// Study: Make `createOrganizationRoleService` available to other files. Its result arrives after its work finishes.
export const createOrganizationRoleService = async (organizationId: string, data: CreateRoleData) => {
    // Study: Call `findOrganizationRoleByName` and wait for it to finish and store its result in `existingRole`.
    const existingRole = await findOrganizationRoleByName(organizationId, data.name);
    // Study: Do the next step if this check passes: `existingRole`.
    if (existingRole) {
        // Study: Stop here and report this problem: "A role with this name already exists in your organization."
        throw new BadRequestError("A role with this name already exists in your organization.");
    // Study: End this group of steps.
    }
    // Study: Give `await createOrganizationRole(organizationId, data)` back to the code that asked for it.
    return await createOrganizationRole(organizationId, data);
// Study: End this group of steps.
};

// Study: Make `getOrganizationRolesService` available to other files. Its result arrives after its work finishes.
export const getOrganizationRolesService = async (organizationId: string) => {
    // Study: Give `await findOrganizationRoles(organizationId)` back to the code that asked for it.
    return await findOrganizationRoles(organizationId);
// Study: End this group of steps.
};

// Study: Make `getOrganizationRoleService` available to other files. Its result arrives after its work finishes.
export const getOrganizationRoleService = async (id: string, organizationId: string) => {
    // Study: Call `findOrganizationRoleByIdWithPermissions` and wait for it to finish and store its result in `role`.
    const role = await findOrganizationRoleByIdWithPermissions(id, organizationId);
    // Study: Do the next step if there is no value for `role`.
    if (!role) {
        // Study: Stop here and report this problem: "Role not found."
        throw new NotFoundError("Role not found.");
    // Study: End this group of steps.
    }
    // Study: Give `role` back to the code that asked for it.
    return role;
// Study: End this group of steps.
};

// Study: Make `updateOrganizationRoleService` available to other files. Its result arrives after its work finishes.
export const updateOrganizationRoleService = async (id: string, organizationId: string, data: UpdateRoleData) => {
    // Study: Call `findOrganizationRoleById` and wait for it to finish and store its result in `organizationRole`.
    const organizationRole = await findOrganizationRoleById(id, organizationId);
    
    // Study: Do the next step if there is no value for `organizationRole`.
    if (!organizationRole) {
        // Study: Stop here and report this problem: "Role not found."
        throw new NotFoundError("Role not found.");
    // Study: End this group of steps.
    }

    // Do not allow changing name or description of a GLOBAL role.
    // Study: Do the next step if this check passes: `organizationRole.role.isGlobal`.
    if (organizationRole.role.isGlobal) {
        // Study: Do the next step if this check passes: `data.name !== undefined || data.description !== undefined`.
        if (data.name !== undefined || data.description !== undefined) {
            // Study: Stop here and report this problem: "You cannot modify the name or description of a global role."
            throw new ForbiddenError("You cannot modify the name or description of a global role.");
        // Study: End this group of steps.
        }
    // Study: Run this branch if the preceding conditions failed.
    } else {
        // For custom roles, make sure name doesn't conflict
        // Study: Do the next step if this check passes: `data.name && data.name !== organizationRole.role.name`.
        if (data.name && data.name !== organizationRole.role.name) {
            // Study: Call `findOrganizationRoleByName` and wait for it to finish and store its result in `existingRole`.
            const existingRole = await findOrganizationRoleByName(organizationId, data.name);
            // Study: Do the next step if this check passes: `existingRole`.
            if (existingRole) {
                // Study: Stop here and report this problem: "A role with this name already exists in your organization."
                throw new BadRequestError("A role with this name already exists in your organization.");
            // Study: End this group of steps.
            }
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Study: Give `await updateOrganizationRole(id, organizationId, data)` back to the code that asked for it.
    return await updateOrganizationRole(id, organizationId, data);
// Study: End this group of steps.
};

// Study: Make `deleteOrganizationRoleService` available to other files. Its result arrives after its work finishes.
export const deleteOrganizationRoleService = async (id: string, organizationId: string) => {
    // Study: Call `findOrganizationRoleById` and wait for it to finish and store its result in `organizationRole`.
    const organizationRole = await findOrganizationRoleById(id, organizationId);
    
    // Study: Do the next step if there is no value for `organizationRole`.
    if (!organizationRole) {
        // Study: Stop here and report this problem: "Role not found."
        throw new NotFoundError("Role not found.");
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `organizationRole.role.isGlobal`.
    if (organizationRole.role.isGlobal) {
        // Study: Stop here and report this problem: "You cannot delete a global role from your organization."
        throw new ForbiddenError("You cannot delete a global role from your organization.");
    // Study: End this group of steps.
    }

    // Study: Call `countUsersWithOrganizationRole` and wait for it to finish and store its result in `userCount`.
    const userCount = await countUsersWithOrganizationRole(id);
    // Study: Do the next step if this check passes: `userCount > 0`.
    if (userCount > 0) {
        // Study: Stop here and report this problem: "This role cannot be deleted because it is assigned to users."
        throw new BadRequestError("This role cannot be deleted because it is assigned to users.");
    // Study: End this group of steps.
    }

    // Study: Give `await deleteOrganizationRole(id, organizationId)` back to the code that asked for it.
    return await deleteOrganizationRole(id, organizationId);
// Study: End this group of steps.
};