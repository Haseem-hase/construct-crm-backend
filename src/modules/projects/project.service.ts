import * as projectRepository from "./project.repository";
import { CreateProjectInput, UpdateProjectInput } from "./project.types";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { NotFoundError } from "../../errors/NotFoundError";

// create project
export const createProject = async (
    data: CreateProjectInput & { customerId?: string },
    user: AuthenticatedUser
) => {
    if (!user.organizationId) {
        throw new UnauthorizedError("User is not associated with an organization.");
    }

    // IMPORTANT: ProjectCustomer infrastructure does not exist yet.
    // The transaction to create Project + ProjectCustomer atomically 
    // is halted here to avoid modifying unrelated modules or inventing missing architecture.
    
    // For now, we create the project without the customer association.
    const project = await projectRepository.createProject({
        ...data,
        organizationId: user.organizationId,
    });

    return project;
};

// get all project under organization
export const getOrganizationProjects = async (
    user: AuthenticatedUser
) => {
    if (!user.organizationId) {
        throw new UnauthorizedError("User is not associated with an organization.");
    }

    return await projectRepository.findProjectsByOrganizationId(
        user.organizationId
    );
};

// get project by id
export const getProjectById = async (
    projectId: string,
    user: AuthenticatedUser
) => {
    if (!user.organizationId) {
        throw new UnauthorizedError("User is not associated with an organization.");
    }

    const project = await projectRepository.findProjectByIdAndOrganization(
        projectId,
        user.organizationId
    );

    if (!project) {
        throw new NotFoundError("Project not found.");
    }

    return project;
};

// update project
export const updateProject = async (
    projectId: string,
    data: UpdateProjectInput,
    user: AuthenticatedUser
) => {
    if (!user.organizationId) {
        throw new UnauthorizedError("User is not associated with an organization.");
    }

    const project = await projectRepository.updateProject(
        projectId,
        user.organizationId,
        data
    );

    if (!project) {
        throw new NotFoundError("Project not found.");
    }

    return project;
};

// delete project
export const deleteProject = async (
    projectId: string,
    user: AuthenticatedUser
) => {
    if (!user.organizationId) {
        throw new UnauthorizedError("User is not associated with an organization.");
    }

    const isDeleted = await projectRepository.deleteProject(
        projectId,
        user.organizationId
    );

    if (!isDeleted) {
        throw new NotFoundError("Project not found.");
    }

    return true;
};