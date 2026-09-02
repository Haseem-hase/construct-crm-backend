import * as projectRepository from "./project.repository";

import { CreateProjectInput } from "./project.types";

import { AuthenticatedUser } from "../../shared/types/authenticated-user";

import { UnauthorizedError } from "../../errors/UnauthorizedError";

//create project
export const createProject = async (
    data: CreateProjectInput,
    user: AuthenticatedUser
) => {

    if (!user.organizationId) {
        throw new UnauthorizedError("User is not associated with an organization.");
    }

    const project = await projectRepository.createProject({
        ...data,
        organizationId: user.organizationId,
    });

    return project;
};

//get all project under organization
export const getOrganizationProjects = async (
    user: AuthenticatedUser
) => {

    if(!user.organizationId) {
        throw new UnauthorizedError("User is not associated with an organization.");
    }

    return await projectRepository.findProjectsByOrganizationId(
        user.organizationId
    );
};