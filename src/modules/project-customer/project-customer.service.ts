// Study: Apply business rules and coordinate database operations for relationships between projects and customers.
// Study: Import `* as projectCustomerRepository` from `"./project-customer.repository"`.
import * as projectCustomerRepository from "./project-customer.repository";
// Study: Import `* as projectRepository` from `"../projects/project.repository"`.
import * as projectRepository from "../projects/project.repository";
// Study: Import `* as customerRepository` from `"../customers/customer.repository"`.
import * as customerRepository from "../customers/customer.repository";
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";

// Study: Import `{ CreateProjectCustomerInput, UpdateProjectCustomerInput }` from `"./project-customer.types"`.
import { CreateProjectCustomerInput, UpdateProjectCustomerInput } from "./project-customer.types";
// Study: Import `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"`.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Import `{ ForbiddenError }` from `"../../errors/ForbiddenError"`.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Import `{ NotFoundError }` from `"../../errors/NotFoundError"`.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Import `{ ConflictError }` from `"../../errors/ConflictError"`.
import { ConflictError } from "../../errors/ConflictError";

// Study: Export `createProjectCustomer` as an async function that returns a promise.
export const createProjectCustomer = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `data` with type `CreateProjectCustomerInput`.
    data: CreateProjectCustomerInput,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run the following branch when `!user.organizationId` is truthy.
    if (!user.organizationId) {
        // Study: Stop this execution path by throwing `new ForbiddenError("This operation requires an organization context.")`.
        throw new ForbiddenError("This operation requires an organization context.");
    // Study: Close the code block.
    }

    // Study: Call `projectRepository.findProjectByIdAndOrganization` and wait for it to finish and store its result in `project`.
    const project = await projectRepository.findProjectByIdAndOrganization(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: Close the call arguments.
    );
    // Study: Run the following branch when `!project` is truthy.
    if (!project) {
        // Study: Stop this execution path by throwing `new NotFoundError("Project not found.")`.
        throw new NotFoundError("Project not found.");
    // Study: Close the code block.
    }

    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer = await customerRepository.findCustomerByIdAndOrganization(
        // Study: Supply `customerId` to the surrounding statement.
        customerId,
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: Close the call arguments.
    );
    // Study: Run the following branch when `!customer` is truthy.
    if (!customer) {
        // Study: Stop this execution path by throwing `new NotFoundError("Customer not found.")`.
        throw new NotFoundError("Customer not found.");
    // Study: Close the code block.
    }

    // Study: Call `projectCustomerRepository.findProjectCustomerByRelationship` and wait for it to finish and store its result in `existingRelationship`.
    const existingRelationship = await projectCustomerRepository.findProjectCustomerByRelationship(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `customerId` to the surrounding statement.
        customerId,
        // Study: Supply `data` to the surrounding statement.
        data.relationshipType
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `existingRelationship` is truthy.
    if (existingRelationship) {
        // Study: Stop this execution path by throwing `new ConflictError("Project customer relationship already exists.")`.
        throw new ConflictError("Project customer relationship already exists.");
    // Study: Close the code block.
    }

    // Study: Run the following branch when `data.isPrimary` is truthy.
    if (data.isPrimary) {
        // Study: Return `await prisma.$transaction(async (tx) => { await projectCustomerRepository.clearPrim…` to the caller.
        return await prisma.$transaction(async (tx) => {
            // Study: Call `projectCustomerRepository.clearPrimaryProjectCustomer` and wait for it to finish.
            await projectCustomerRepository.clearPrimaryProjectCustomer(projectId, tx);
            // Study: Return `await projectCustomerRepository.createProjectCustomer( { projectId, customerId, rel…` to the caller.
            return await projectCustomerRepository.createProjectCustomer(
                // Study: Start the object passed to the surrounding expression.
                {
                    // Study: Pass the current `projectId` value under the same property name.
                    projectId,
                    // Study: Pass the current `customerId` value under the same property name.
                    customerId,
                    // Study: Set `relationshipType` to `data.relationshipType`.
                    relationshipType: data.relationshipType,
                    // Study: Set `isPrimary` to `true`.
                    isPrimary: true,
                // Study: Close the object literal.
                },
                // Study: Supply `tx` to the surrounding statement.
                tx
            // Study: Close the call arguments.
            );
        // Study: Close the code block.
        });
    // Study: Close the code block.
    }

    // Study: Return `await projectCustomerRepository.createProjectCustomer({ projectId, customerId, rela…` to the caller.
    return await projectCustomerRepository.createProjectCustomer({
        // Study: Pass the current `projectId` value under the same property name.
        projectId,
        // Study: Pass the current `customerId` value under the same property name.
        customerId,
        // Study: Set `relationshipType` to `data.relationshipType`.
        relationshipType: data.relationshipType,
        // Study: Set `isPrimary` to `data.isPrimary`.
        isPrimary: data.isPrimary,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `getProjectCustomers` as an async function that returns a promise.
export const getProjectCustomers = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `project` to `user.systemRole === "SUPER_ADMIN" ? await projectRepository.findPlatformProjectById…`.
    const project = user.systemRole === "SUPER_ADMIN"
        // Study: Use this value when the preceding condition is truthy.
        ? await projectRepository.findPlatformProjectById(projectId)
        // Study: Use this value when the preceding condition is falsy.
        : user.organizationId
            // Study: Use this value when the preceding condition is truthy.
            ? await projectRepository.findProjectByIdAndOrganization(projectId, user.organizationId)
            // Study: Use this value when the preceding condition is falsy.
            : null;
    // Study: Run the following branch when `!project` is truthy.
    if (!project) {
        // Study: Stop this execution path by throwing `new NotFoundError("Project not found.")`.
        throw new NotFoundError("Project not found.");
    // Study: Close the code block.
    }

    // Study: Return `await projectCustomerRepository.findProjectCustomersByProjectId(projectId)` to the caller.
    return await projectCustomerRepository.findProjectCustomersByProjectId(projectId);
// Study: Close the code block.
};

// Study: Export `getProjectCustomer` as an async function that returns a promise.
export const getProjectCustomer = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `projectCustomerId` with type `string`.
    projectCustomerId: string,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `project` to `user.systemRole === "SUPER_ADMIN" ? await projectRepository.findPlatformProjectById…`.
    const project = user.systemRole === "SUPER_ADMIN"
        // Study: Use this value when the preceding condition is truthy.
        ? await projectRepository.findPlatformProjectById(projectId)
        // Study: Use this value when the preceding condition is falsy.
        : user.organizationId
            // Study: Use this value when the preceding condition is truthy.
            ? await projectRepository.findProjectByIdAndOrganization(projectId, user.organizationId)
            // Study: Use this value when the preceding condition is falsy.
            : null;
    // Study: Run the following branch when `!project` is truthy.
    if (!project) {
        // Study: Stop this execution path by throwing `new NotFoundError("Project not found.")`.
        throw new NotFoundError("Project not found.");
    // Study: Close the code block.
    }

    // Study: Call `projectCustomerRepository.findProjectCustomerById` and wait for it to finish and store its result in `relationship`.
    const relationship = await projectCustomerRepository.findProjectCustomerById(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `projectCustomerId` to the surrounding statement.
        projectCustomerId
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `!relationship` is truthy.
    if (!relationship) {
        // Study: Stop this execution path by throwing `new NotFoundError("Project customer relationship not found.")`.
        throw new NotFoundError("Project customer relationship not found.");
    // Study: Close the code block.
    }

    // Study: Return `relationship` to the caller.
    return relationship;
// Study: Close the code block.
};

// Study: Export `updateProjectCustomer` as an async function that returns a promise.
export const updateProjectCustomer = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `projectCustomerId` with type `string`.
    projectCustomerId: string,
    // Study: Accept `data` with type `UpdateProjectCustomerInput`.
    data: UpdateProjectCustomerInput,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run the following branch when `!user.organizationId` is truthy and throw `new ForbiddenError("This operation requires an organization context.")`.
    if (!user.organizationId) throw new ForbiddenError("This operation requires an organization context.");

    // Study: Call `projectRepository.findProjectByIdAndOrganization` and wait for it to finish and store its result in `project`.
    const project = await projectRepository.findProjectByIdAndOrganization(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: Close the call arguments.
    );
    // Study: Run the following branch when `!project` is truthy.
    if (!project) {
        // Study: Stop this execution path by throwing `new NotFoundError("Project not found.")`.
        throw new NotFoundError("Project not found.");
    // Study: Close the code block.
    }

    // Study: Call `projectCustomerRepository.findProjectCustomerById` and wait for it to finish and store its result in `existingRelationship`.
    const existingRelationship = await projectCustomerRepository.findProjectCustomerById(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `projectCustomerId` to the surrounding statement.
        projectCustomerId
    // Study: Close the call arguments.
    );
    // Study: Run the following branch when `!existingRelationship` is truthy.
    if (!existingRelationship) {
        // Study: Stop this execution path by throwing `new NotFoundError("Project customer relationship not found.")`.
        throw new NotFoundError("Project customer relationship not found.");
    // Study: Close the code block.
    }

    // Study: Run the following branch when `data.relationshipType !== undefined && data.relationshipType !== existingRelationsh…` is truthy.
    if (data.relationshipType !== undefined && data.relationshipType !== existingRelationship.relationshipType) {
        // Study: Call `projectCustomerRepository.findProjectCustomerByRelationship` and wait for it to finish and store its result in `duplicate`.
        const duplicate = await projectCustomerRepository.findProjectCustomerByRelationship(
            // Study: Supply `projectId` to the surrounding statement.
            projectId,
            // Study: Supply `existingRelationship` to the surrounding statement.
            existingRelationship.customerId,
            // Study: Supply `data` to the surrounding statement.
            data.relationshipType
        // Study: Close the call arguments.
        );
        // Study: Run the following branch when `duplicate` is truthy.
        if (duplicate) {
            // Study: Stop this execution path by throwing `new ConflictError("Project customer relationship already exists.")`.
            throw new ConflictError("Project customer relationship already exists.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Study: Run the following branch when `data.isPrimary` is truthy.
    if (data.isPrimary) {
        // Study: Return `await prisma.$transaction(async (tx) => { await projectCustomerRepository.clearPrim…` to the caller.
        return await prisma.$transaction(async (tx) => {
            // Study: Call `projectCustomerRepository.clearPrimaryProjectCustomer` and wait for it to finish.
            await projectCustomerRepository.clearPrimaryProjectCustomer(projectId, tx);
            
            // Study: Call `projectCustomerRepository.updateProjectCustomer` and wait for it to finish and store its result in `updated`.
            const updated = await projectCustomerRepository.updateProjectCustomer(
                // Study: Supply `projectId` to the surrounding statement.
                projectId,
                // Study: Supply `projectCustomerId` to the surrounding statement.
                projectCustomerId,
                // Study: Supply `data` to the surrounding statement.
                data,
                // Study: Supply `tx` to the surrounding statement.
                tx
            // Study: Close the call arguments.
            );

            // Study: Run the following branch when `!updated` is truthy.
            if (!updated) {
                // Study: Stop this execution path by throwing `new NotFoundError("Project customer relationship not found.")`.
                throw new NotFoundError("Project customer relationship not found.");
            // Study: Close the code block.
            }

            // Study: Return `updated` to the caller.
            return updated;
        // Study: Close the code block.
        });
    // Study: Close the code block.
    }

    // Study: Call `projectCustomerRepository.updateProjectCustomer` and wait for it to finish and store its result in `updated`.
    const updated = await projectCustomerRepository.updateProjectCustomer(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `projectCustomerId` to the surrounding statement.
        projectCustomerId,
        // Study: Supply `data` to the surrounding statement.
        data
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `!updated` is truthy.
    if (!updated) {
        // Study: Stop this execution path by throwing `new NotFoundError("Project customer relationship not found.")`.
        throw new NotFoundError("Project customer relationship not found.");
    // Study: Close the code block.
    }

    // Study: Return `updated` to the caller.
    return updated;
// Study: Close the code block.
};

// Study: Export `deleteProjectCustomer` as an async function that returns a promise.
export const deleteProjectCustomer = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `projectCustomerId` with type `string`.
    projectCustomerId: string,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run the following branch when `!user.organizationId` is truthy and throw `new ForbiddenError("This operation requires an organization context.")`.
    if (!user.organizationId) throw new ForbiddenError("This operation requires an organization context.");

    // Study: Call `projectRepository.findProjectByIdAndOrganization` and wait for it to finish and store its result in `project`.
    const project = await projectRepository.findProjectByIdAndOrganization(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: Close the call arguments.
    );
    // Study: Run the following branch when `!project` is truthy.
    if (!project) {
        // Study: Stop this execution path by throwing `new NotFoundError("Project not found.")`.
        throw new NotFoundError("Project not found.");
    // Study: Close the code block.
    }

    // Study: Call `projectCustomerRepository.findProjectCustomerById` and wait for it to finish and store its result in `relationship`.
    const relationship = await projectCustomerRepository.findProjectCustomerById(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `projectCustomerId` to the surrounding statement.
        projectCustomerId
    // Study: Close the call arguments.
    );
    // Study: Run the following branch when `!relationship` is truthy.
    if (!relationship) {
        // Study: Stop this execution path by throwing `new NotFoundError("Project customer relationship not found.")`.
        throw new NotFoundError("Project customer relationship not found.");
    // Study: Close the code block.
    }

    // Study: Return `await projectCustomerRepository.deleteProjectCustomer( projectId, projectCustomerId )` to the caller.
    return await projectCustomerRepository.deleteProjectCustomer(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `projectCustomerId` to the surrounding statement.
        projectCustomerId
    // Study: Close the call arguments.
    );
// Study: Close the code block.
};
