// Study: This file is about which customers are connected to each job and in what role. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `* as projectCustomerRepository` from `"./project-customer.repository"` so this file can use it.
import * as projectCustomerRepository from "./project-customer.repository";
// Study: Bring in `* as projectRepository` from `"../projects/project.repository"` so this file can use it.
import * as projectRepository from "../projects/project.repository";
// Study: Bring in `* as customerRepository` from `"../customers/customer.repository"` so this file can use it.
import * as customerRepository from "../customers/customer.repository";
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";

// Study: Bring in `{ CreateProjectCustomerInput, UpdateProjectCustomerInput }` from `"./project-customer.types"` so this file can use it.
import { CreateProjectCustomerInput, UpdateProjectCustomerInput } from "./project-customer.types";
// Study: Bring in `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"` so this file can use it.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Bring in `{ ForbiddenError }` from `"../../errors/ForbiddenError"` so this file can use it.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Bring in `{ NotFoundError }` from `"../../errors/NotFoundError"` so this file can use it.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Bring in `{ ConflictError }` from `"../../errors/ConflictError"` so this file can use it.
import { ConflictError } from "../../errors/ConflictError";

// Study: Make `createProjectCustomer` available to other files. Its result arrives after its work finishes.
export const createProjectCustomer = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `data`. `CreateProjectCustomerInput` describes what that information should look like.
    data: CreateProjectCustomerInput,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Do the next step if this check passes: `!user.organizationId`.
    if (!user.organizationId) {
        // Study: Stop here and report this problem: "This operation requires an organization context."
        throw new ForbiddenError("This operation requires an organization context.");
    // Study: End this group of steps.
    }

    // Study: Call `projectRepository.findProjectByIdAndOrganization` and wait for it to finish and store its result in `project`.
    const project = await projectRepository.findProjectByIdAndOrganization(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: End the list of information being sent to this step.
    );
    // Study: Do the next step if there is no value for `project`.
    if (!project) {
        // Study: Stop here and report this problem: "Project not found."
        throw new NotFoundError("Project not found.");
    // Study: End this group of steps.
    }

    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer = await customerRepository.findCustomerByIdAndOrganization(
        // Study: Supply `customerId` to the surrounding statement.
        customerId,
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: End the list of information being sent to this step.
    );
    // Study: Do the next step if there is no value for `customer`.
    if (!customer) {
        // Study: Stop here and report this problem: "Customer not found."
        throw new NotFoundError("Customer not found.");
    // Study: End this group of steps.
    }

    // Study: Call `projectCustomerRepository.findProjectCustomerByRelationship` and wait for it to finish and store its result in `existingRelationship`.
    const existingRelationship = await projectCustomerRepository.findProjectCustomerByRelationship(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `customerId` to the surrounding statement.
        customerId,
        // Study: Use the relationship type that was submitted for this step.
        data.relationshipType
    // Study: End the list of information being sent to this step.
    );

    // Study: Do the next step if this check passes: `existingRelationship`.
    if (existingRelationship) {
        // Study: Stop here and report this problem: "Project customer relationship already exists."
        throw new ConflictError("Project customer relationship already exists.");
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `data.isPrimary`.
    if (data.isPrimary) {
        // Study: Give `await prisma.$transaction(async (tx) => { await projectCustomerRepository.clearPrim…` back to the code that asked for it.
        return await prisma.$transaction(async (tx) => {
            // Study: Call `projectCustomerRepository.clearPrimaryProjectCustomer` and wait for it to finish.
            await projectCustomerRepository.clearPrimaryProjectCustomer(projectId, tx);
            // Study: Give `await projectCustomerRepository.createProjectCustomer( { projectId, customerId, rel…` back to the code that asked for it.
            return await projectCustomerRepository.createProjectCustomer(
                // Study: Start the object passed to the surrounding expression.
                {
                    // Study: Carry the value of `projectId` into the new group under the same name.
                    projectId,
                    // Study: Carry the value of `customerId` into the new group under the same name.
                    customerId,
                    // Study: Set `relationshipType` to `data.relationshipType`.
                    relationshipType: data.relationshipType,
                    // Study: Set `isPrimary` to `true`.
                    isPrimary: true,
                // Study: End this group of values.
                },
                // Study: Supply `tx` to the surrounding statement.
                tx
            // Study: End the list of information being sent to this step.
            );
        // Study: End this group of steps.
        });
    // Study: End this group of steps.
    }

    // Study: Give `await projectCustomerRepository.createProjectCustomer({ projectId, customerId, rela…` back to the code that asked for it.
    return await projectCustomerRepository.createProjectCustomer({
        // Study: Carry the value of `projectId` into the new group under the same name.
        projectId,
        // Study: Carry the value of `customerId` into the new group under the same name.
        customerId,
        // Study: Set `relationshipType` to `data.relationshipType`.
        relationshipType: data.relationshipType,
        // Study: Set `isPrimary` to `data.isPrimary`.
        isPrimary: data.isPrimary,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `getProjectCustomers` available to other files. Its result arrives after its work finishes.
export const getProjectCustomers = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `project` to `user.systemRole === "SUPER_ADMIN" ? await projectRepository.findPlatformProjectById…`.
    const project = user.systemRole === "SUPER_ADMIN"
        // Study: Use this value if the check above passes.
        ? await projectRepository.findPlatformProjectById(projectId)
        // Study: Use this value if the check above fails.
        : user.organizationId
            // Study: Use this value if the check above passes.
            ? await projectRepository.findProjectByIdAndOrganization(projectId, user.organizationId)
            // Study: Use this value if the check above fails.
            : null;
    // Study: Do the next step if there is no value for `project`.
    if (!project) {
        // Study: Stop here and report this problem: "Project not found."
        throw new NotFoundError("Project not found.");
    // Study: End this group of steps.
    }

    // Study: Give `await projectCustomerRepository.findProjectCustomersByProjectId(projectId)` back to the code that asked for it.
    return await projectCustomerRepository.findProjectCustomersByProjectId(projectId);
// Study: End this group of steps.
};

// Study: Make `getProjectCustomer` available to other files. Its result arrives after its work finishes.
export const getProjectCustomer = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `projectCustomerId`. `string` describes what that information should look like.
    projectCustomerId: string,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `project` to `user.systemRole === "SUPER_ADMIN" ? await projectRepository.findPlatformProjectById…`.
    const project = user.systemRole === "SUPER_ADMIN"
        // Study: Use this value if the check above passes.
        ? await projectRepository.findPlatformProjectById(projectId)
        // Study: Use this value if the check above fails.
        : user.organizationId
            // Study: Use this value if the check above passes.
            ? await projectRepository.findProjectByIdAndOrganization(projectId, user.organizationId)
            // Study: Use this value if the check above fails.
            : null;
    // Study: Do the next step if there is no value for `project`.
    if (!project) {
        // Study: Stop here and report this problem: "Project not found."
        throw new NotFoundError("Project not found.");
    // Study: End this group of steps.
    }

    // Study: Call `projectCustomerRepository.findProjectCustomerById` and wait for it to finish and store its result in `relationship`.
    const relationship = await projectCustomerRepository.findProjectCustomerById(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `projectCustomerId` to the surrounding statement.
        projectCustomerId
    // Study: End the list of information being sent to this step.
    );

    // Study: Do the next step if there is no value for `relationship`.
    if (!relationship) {
        // Study: Stop here and report this problem: "Project customer relationship not found."
        throw new NotFoundError("Project customer relationship not found.");
    // Study: End this group of steps.
    }

    // Study: Give `relationship` back to the code that asked for it.
    return relationship;
// Study: End this group of steps.
};

// Study: Make `updateProjectCustomer` available to other files. Its result arrives after its work finishes.
export const updateProjectCustomer = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `projectCustomerId`. `string` describes what that information should look like.
    projectCustomerId: string,
    // Study: This step receives `data`. `UpdateProjectCustomerInput` describes what that information should look like.
    data: UpdateProjectCustomerInput,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Do the next step if this check passes: `!user.organizationId` . If so, stop and report "This operation requires an organization context."
    if (!user.organizationId) throw new ForbiddenError("This operation requires an organization context.");

    // Study: Call `projectRepository.findProjectByIdAndOrganization` and wait for it to finish and store its result in `project`.
    const project = await projectRepository.findProjectByIdAndOrganization(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: End the list of information being sent to this step.
    );
    // Study: Do the next step if there is no value for `project`.
    if (!project) {
        // Study: Stop here and report this problem: "Project not found."
        throw new NotFoundError("Project not found.");
    // Study: End this group of steps.
    }

    // Study: Call `projectCustomerRepository.findProjectCustomerById` and wait for it to finish and store its result in `existingRelationship`.
    const existingRelationship = await projectCustomerRepository.findProjectCustomerById(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `projectCustomerId` to the surrounding statement.
        projectCustomerId
    // Study: End the list of information being sent to this step.
    );
    // Study: Do the next step if there is no value for `existingRelationship`.
    if (!existingRelationship) {
        // Study: Stop here and report this problem: "Project customer relationship not found."
        throw new NotFoundError("Project customer relationship not found.");
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `data.relationshipType !== undefined && data.relationshipType !== existingRelationsh…`.
    if (data.relationshipType !== undefined && data.relationshipType !== existingRelationship.relationshipType) {
        // Study: Call `projectCustomerRepository.findProjectCustomerByRelationship` and wait for it to finish and store its result in `duplicate`.
        const duplicate = await projectCustomerRepository.findProjectCustomerByRelationship(
            // Study: Supply `projectId` to the surrounding statement.
            projectId,
            // Study: Supply `existingRelationship` to the surrounding statement.
            existingRelationship.customerId,
            // Study: Use the relationship type that was submitted for this step.
            data.relationshipType
        // Study: End the list of information being sent to this step.
        );
        // Study: Do the next step if this check passes: `duplicate`.
        if (duplicate) {
            // Study: Stop here and report this problem: "Project customer relationship already exists."
            throw new ConflictError("Project customer relationship already exists.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `data.isPrimary`.
    if (data.isPrimary) {
        // Study: Give `await prisma.$transaction(async (tx) => { await projectCustomerRepository.clearPrim…` back to the code that asked for it.
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
            // Study: End the list of information being sent to this step.
            );

            // Study: Do the next step if there is no value for `updated`.
            if (!updated) {
                // Study: Stop here and report this problem: "Project customer relationship not found."
                throw new NotFoundError("Project customer relationship not found.");
            // Study: End this group of steps.
            }

            // Study: Give `updated` back to the code that asked for it.
            return updated;
        // Study: End this group of steps.
        });
    // Study: End this group of steps.
    }

    // Study: Call `projectCustomerRepository.updateProjectCustomer` and wait for it to finish and store its result in `updated`.
    const updated = await projectCustomerRepository.updateProjectCustomer(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `projectCustomerId` to the surrounding statement.
        projectCustomerId,
        // Study: Supply `data` to the surrounding statement.
        data
    // Study: End the list of information being sent to this step.
    );

    // Study: Do the next step if there is no value for `updated`.
    if (!updated) {
        // Study: Stop here and report this problem: "Project customer relationship not found."
        throw new NotFoundError("Project customer relationship not found.");
    // Study: End this group of steps.
    }

    // Study: Give `updated` back to the code that asked for it.
    return updated;
// Study: End this group of steps.
};

// Study: Make `deleteProjectCustomer` available to other files. Its result arrives after its work finishes.
export const deleteProjectCustomer = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `projectCustomerId`. `string` describes what that information should look like.
    projectCustomerId: string,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Do the next step if this check passes: `!user.organizationId` . If so, stop and report "This operation requires an organization context."
    if (!user.organizationId) throw new ForbiddenError("This operation requires an organization context.");

    // Study: Call `projectRepository.findProjectByIdAndOrganization` and wait for it to finish and store its result in `project`.
    const project = await projectRepository.findProjectByIdAndOrganization(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: End the list of information being sent to this step.
    );
    // Study: Do the next step if there is no value for `project`.
    if (!project) {
        // Study: Stop here and report this problem: "Project not found."
        throw new NotFoundError("Project not found.");
    // Study: End this group of steps.
    }

    // Study: Call `projectCustomerRepository.findProjectCustomerById` and wait for it to finish and store its result in `relationship`.
    const relationship = await projectCustomerRepository.findProjectCustomerById(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `projectCustomerId` to the surrounding statement.
        projectCustomerId
    // Study: End the list of information being sent to this step.
    );
    // Study: Do the next step if there is no value for `relationship`.
    if (!relationship) {
        // Study: Stop here and report this problem: "Project customer relationship not found."
        throw new NotFoundError("Project customer relationship not found.");
    // Study: End this group of steps.
    }

    // Study: Give `await projectCustomerRepository.deleteProjectCustomer( projectId, projectCustomerId )` back to the code that asked for it.
    return await projectCustomerRepository.deleteProjectCustomer(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `projectCustomerId` to the surrounding statement.
        projectCustomerId
    // Study: End the list of information being sent to this step.
    );
// Study: End this group of steps.
};
