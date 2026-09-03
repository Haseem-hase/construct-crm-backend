import { BadRequestError } from "../../errors/BadRequestError";
import { ForbiddenError } from "../../errors/ForbiddenError";
import { NotFoundError } from "../../errors/NotFoundError";
import { 
    countUsersWithOrganizationRole, 
    createGlobalRole, 
    createOrganizationRole, 
    deleteGlobalRole, 
    deleteOrganizationRole, 
    findGlobalRoleById, 
    findGlobalRoleByName, 
    findGlobalRoles, 
    findOrganizationRoleById, 
    findOrganizationRoleByIdWithPermissions, 
    findOrganizationRoleByName, 
    findOrganizationRoles, 
    updateGlobalRole, 
    updateOrganizationRole 
} from "./role.repository";
import { CreateRoleData, UpdateRoleData } from "./role.types";

// ==========================================
// GLOBAL ROLE SERVICES (SUPER_ADMIN)
// ==========================================

export const createGlobalRoleService = async (data: CreateRoleData) => {
    const existingRole = await findGlobalRoleByName(data.name);
    if (existingRole) {
        throw new BadRequestError("A global role with this name already exists.");
    }
    return await createGlobalRole(data);
};

export const getGlobalRolesService = async () => {
    return await findGlobalRoles();
};

export const getGlobalRoleService = async (roleId: string) => {
    const role = await findGlobalRoleById(roleId);
    if (!role) {
        throw new NotFoundError("Global role not found.");
    }
    return role;
};

export const updateGlobalRoleService = async (roleId: string, data: UpdateRoleData) => {
    const role = await findGlobalRoleById(roleId);
    if (!role) {
        throw new NotFoundError("Global role not found.");
    }

    if (data.name && data.name !== role.name) {
        const existingRole = await findGlobalRoleByName(data.name);
        if (existingRole) {
            throw new BadRequestError("A global role with this name already exists.");
        }
    }

    return await updateGlobalRole(roleId, data);
};

export const deleteGlobalRoleService = async (roleId: string) => {
    const role = await findGlobalRoleById(roleId);
    if (!role) {
        throw new NotFoundError("Global role not found.");
    }
    return await deleteGlobalRole(roleId);
};


// ==========================================
// ORGANIZATION ROLE SERVICES (ORGANIZATION_OWNER)
// ==========================================

export const createOrganizationRoleService = async (organizationId: string, data: CreateRoleData) => {
    const existingRole = await findOrganizationRoleByName(organizationId, data.name);
    if (existingRole) {
        throw new BadRequestError("A role with this name already exists in your organization.");
    }
    return await createOrganizationRole(organizationId, data);
};

export const getOrganizationRolesService = async (organizationId: string) => {
    return await findOrganizationRoles(organizationId);
};

export const getOrganizationRoleService = async (id: string, organizationId: string) => {
    const role = await findOrganizationRoleByIdWithPermissions(id, organizationId);
    if (!role) {
        throw new NotFoundError("Role not found.");
    }
    return role;
};

export const updateOrganizationRoleService = async (id: string, organizationId: string, data: UpdateRoleData) => {
    const organizationRole = await findOrganizationRoleById(id, organizationId);
    
    if (!organizationRole) {
        throw new NotFoundError("Role not found.");
    }

    // Do not allow changing name or description of a GLOBAL role.
    if (organizationRole.role.isGlobal) {
        if (data.name !== undefined || data.description !== undefined) {
            throw new ForbiddenError("You cannot modify the name or description of a global role.");
        }
    } else {
        // For custom roles, make sure name doesn't conflict
        if (data.name && data.name !== organizationRole.role.name) {
            const existingRole = await findOrganizationRoleByName(organizationId, data.name);
            if (existingRole) {
                throw new BadRequestError("A role with this name already exists in your organization.");
            }
        }
    }

    return await updateOrganizationRole(id, organizationId, data);
};

export const deleteOrganizationRoleService = async (id: string, organizationId: string) => {
    const organizationRole = await findOrganizationRoleById(id, organizationId);
    
    if (!organizationRole) {
        throw new NotFoundError("Role not found.");
    }

    if (organizationRole.role.isGlobal) {
        throw new ForbiddenError("You cannot delete a global role from your organization.");
    }

    const userCount = await countUsersWithOrganizationRole(id);
    if (userCount > 0) {
        throw new BadRequestError("This role cannot be deleted because it is assigned to users.");
    }

    return await deleteOrganizationRole(id, organizationId);
};