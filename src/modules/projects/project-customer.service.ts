import * as projectCustomerRepository from "./project-customer.repository";
import * as projectRepository from "./project.repository";
import * as customerRepository from "../customers/customer.repository";
import prisma from "../../lib/prisma";

import { CreateProjectCustomerInput, UpdateProjectCustomerInput } from "./project-customer.types";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { NotFoundError } from "../../errors/NotFoundError";
import { ConflictError } from "../../errors/ConflictError";

export const createProjectCustomer = async (
    projectId: string,
    customerId: string,
    data: CreateProjectCustomerInput,
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

    const customer = await customerRepository.findCustomerByIdAndOrganization(
        customerId,
        user.organizationId
    );
    if (!customer) {
        throw new NotFoundError("Customer not found.");
    }

    const existingRelationship = await projectCustomerRepository.findProjectCustomerByRelationship(
        projectId,
        customerId,
        data.relationshipType
    );

    if (existingRelationship) {
        throw new ConflictError("Project customer relationship already exists.");
    }

    if (data.isPrimary) {
        return await prisma.$transaction(async (tx) => {
            await projectCustomerRepository.clearPrimaryProjectCustomer(projectId, tx);
            return await projectCustomerRepository.createProjectCustomer(
                {
                    projectId,
                    customerId,
                    relationshipType: data.relationshipType,
                    isPrimary: true,
                },
                tx
            );
        });
    }

    return await projectCustomerRepository.createProjectCustomer({
        projectId,
        customerId,
        relationshipType: data.relationshipType,
        isPrimary: data.isPrimary,
    });
};

export const getProjectCustomers = async (
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

    return await projectCustomerRepository.findProjectCustomersByProjectId(projectId);
};

export const getProjectCustomer = async (
    projectId: string,
    projectCustomerId: string,
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

    const relationship = await projectCustomerRepository.findProjectCustomerById(
        projectId,
        projectCustomerId
    );

    if (!relationship) {
        throw new NotFoundError("Project customer relationship not found.");
    }

    return relationship;
};

export const updateProjectCustomer = async (
    projectId: string,
    projectCustomerId: string,
    data: UpdateProjectCustomerInput,
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

    const existingRelationship = await projectCustomerRepository.findProjectCustomerById(
        projectId,
        projectCustomerId
    );
    if (!existingRelationship) {
        throw new NotFoundError("Project customer relationship not found.");
    }

    if (data.relationshipType !== undefined && data.relationshipType !== existingRelationship.relationshipType) {
        const duplicate = await projectCustomerRepository.findProjectCustomerByRelationship(
            projectId,
            existingRelationship.customerId,
            data.relationshipType
        );
        if (duplicate) {
            throw new ConflictError("Project customer relationship already exists.");
        }
    }

    if (data.isPrimary) {
        return await prisma.$transaction(async (tx) => {
            await projectCustomerRepository.clearPrimaryProjectCustomer(projectId, tx);
            
            const updated = await projectCustomerRepository.updateProjectCustomer(
                projectId,
                projectCustomerId,
                data,
                tx
            );

            if (!updated) {
                throw new NotFoundError("Project customer relationship not found.");
            }

            return updated;
        });
    }

    const updated = await projectCustomerRepository.updateProjectCustomer(
        projectId,
        projectCustomerId,
        data
    );

    if (!updated) {
        throw new NotFoundError("Project customer relationship not found.");
    }

    return updated;
};

export const deleteProjectCustomer = async (
    projectId: string,
    projectCustomerId: string,
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

    const relationship = await projectCustomerRepository.findProjectCustomerById(
        projectId,
        projectCustomerId
    );
    if (!relationship) {
        throw new NotFoundError("Project customer relationship not found.");
    }

    return await projectCustomerRepository.deleteProjectCustomer(
        projectId,
        projectCustomerId
    );
};
