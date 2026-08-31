import { BadRequestError } from "../../errors/BadRequestError";
import { ForbiddenError } from "../../errors/ForbiddenError";
import { NotFoundError } from "../../errors/NotFoundError";
import { countUsersWithRole, createRole, deleteRole, findRoleById, findRoleByIdWithPermissions, findRoleByName, findRolesByOrganization, updateRole } from "./role.repository";
import { CreateRoleData, UpdateRoleData } from "./role.types";

//create a role for an organization
export const createRoleService = async (
    organizationId: string,
    data: CreateRoleData
) => {

    //check if another role with same name already exist in the organization
    const existingRole = await findRoleByName(
        organizationId,
        data.name
    );

    if(existingRole) {
        throw new BadRequestError("A role with this name already exist in your organization.");
    }

    //create the role
    return await createRole(
        organizationId,
        data
    );
};

//get all roles belonging to an organization
export const getRolesService = async (
    organizationId: string
) => {

    return await findRolesByOrganization(
        organizationId
    );
};

//get a single role
export const getRoleService = async (
    roleId: string,
    organizationId: string
) => {
    const role = await findRoleByIdWithPermissions(
        roleId
    );

    if(!role) {
        throw new NotFoundError("Role not found.");
    }

    //organization isolation - a user cannot be able to access the roles of another organization
    if(role.organizationId !== organizationId) {
        throw new ForbiddenError("You are not authorized to access this role.");
    }

    return role;
};

//update a role
export const updateRoleService = async (
    roleId: string,
    organizationId: string,
    data: UpdateRoleData
) => {

    //find the role first
    const role = await findRoleById(
        roleId
    );

    if(!role) {
        throw new NotFoundError("Role not found.");
    }

    //lets prevent the modification of roiles belonging to another organization.
    if(role.organizationId !== organizationId) {
        throw new ForbiddenError("You are not authorized to modify this role.");
    }

    //also dont allow organization users to modify system roles
    if(!role.organizationId) {
        throw new ForbiddenError("System roles cannot be modified.");
    }

    //if the role name is updating we need to make sure that name isnt already used
    if(data.name && data.name !== role.name) {

        const existingRole = await findRoleByName(
            organizationId,
            data.name
        );

        if(existingRole) {
            throw new BadRequestError("A role with this name already exists in your organization.");
        }
    }

    return await updateRole(
        roleId,
        data
    );
};

//delete a role
export const deleteRoleService = async (
    roleId: string,
    organizationId: string
) => {

    //find the role first
    const role = await findRoleById(
        roleId
    );

    if(!role) {
        throw new NotFoundError("Role not found.");
    }

    //organization isolation
    if(role.organizationId !== organizationId) {
        throw new ForbiddenError("You are not authorized to delete this role.");
    }

    //system roles cannot be deleted
    if(!role.organizationId) {
        throw new ForbiddenError("System roles cannot be deleted.");
    }

    //dont delete a role that is currently assigned to users.
    const userCount = await countUsersWithRole(
        roleId
    );

    if(userCount > 0) {
        throw new BadRequestError("This role cannot be deleted because it is assigned to users.");
    }

    return await deleteRole(
        roleId
    );
};