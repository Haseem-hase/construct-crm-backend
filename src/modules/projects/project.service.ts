import * as projectRepository from "./project.repository";
import * as projectCustomerRepository from "./project-customer.repository";
import * as customerRepository from "../customers/customer.repository";
import prisma from "../../lib/prisma";
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

    const { customerId, ...projectData } = data;

    if (customerId) {
        const customer = await customerRepository.findCustomerByIdAndOrganization(
            customerId,
            user.organizationId
        );

        if (!customer) {
            throw new NotFoundError("Customer not found.");
        }

        return await prisma.$transaction(async (tx) => {
            const project = await projectRepository.createProject(
                {
                    ...projectData,
                    organizationId: user.organizationId as string,
                },
                tx
            );

            await projectCustomerRepository.createProjectCustomer(
                {
                    projectId: project.id,
                    customerId,
                    relationshipType: "OWNER",
                    isPrimary: true,
                },
                tx
            );

            return project;
        });
    }

    return await projectRepository.createProject({
        ...projectData,
        organizationId: user.organizationId,
    });
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