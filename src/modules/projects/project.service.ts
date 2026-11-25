// Study: This file is about construction jobs, their site details, and their photos. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `* as projectRepository` from `"./project.repository"` so this file can use it.
import * as projectRepository from "./project.repository";
// Study: Bring in `* as projectCustomerRepository` from `"../project-customer/project-customer.repository"` so this file can use it.
import * as projectCustomerRepository from "../project-customer/project-customer.repository";
// Study: Bring in `* as customerRepository` from `"../customers/customer.repository"` so this file can use it.
import * as customerRepository from "../customers/customer.repository";
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";
// Study: Bring in `{ CreateProjectInput, ProjectImageMutation, UpdateProjectInput }` from `"./project.types"` so this file can use it.
import { CreateProjectInput, ProjectImageMutation, UpdateProjectInput } from "./project.types";
// Study: Bring in `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"` so this file can use it.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Bring in `{ ForbiddenError }` from `"../../errors/ForbiddenError"` so this file can use it.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Bring in `{ NotFoundError }` from `"../../errors/NotFoundError"` so this file can use it.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Bring in `{ BadRequestError }` from `"../../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../../errors/BadRequestError";

// create project
// Study: Make `createProject` available to other files. Its result arrives after its work finishes.
export const createProject = async (
    // Study: This step receives `data`. `CreateProjectInput` describes what that information should look like.
    data: CreateProjectInput,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser,
    // Study: This step receives `images` as optional. `ProjectImageMutation[]` describes what that information should look like.
    images?: ProjectImageMutation[]
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Do the next step if this check passes: `!user.organizationId`.
    if (!user.organizationId) {
        // Study: Stop here and report this problem: "This operation requires an organization context."
        throw new ForbiddenError("This operation requires an organization context.");
    // Study: End this group of steps.
    }

    // Study: Set `{ customerId, ...projectData }` to `data`.
    const { customerId, ...projectData } = data;
    // Study: Set `imagesToSave` to `images ?? (data.imageUrl ? [{ imageUrl: data.imageUrl, alt: data.name, isCover: tru…`.
    const imagesToSave = images ?? (data.imageUrl ? [{ imageUrl: data.imageUrl, alt: data.name, isCover: true }] : []);
    // Study: Find the first matching item in `imagesToSave` and store the result as `coverImage`.
    const coverImage = imagesToSave.find(image => image.isCover);
    // Study: Build the object `projectDataWithCover` with the entries below.
    const projectDataWithCover = { ...projectData, ...(images !== undefined ? { imageUrl: coverImage?.imageUrl } : {}) };

    // Study: Do the next step if this check passes: `customerId`.
    if (customerId) {
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

        // Study: Give `await prisma.$transaction(async (tx) => { const project = await projectRepository.c…` back to the code that asked for it.
        return await prisma.$transaction(async (tx) => {
            // Study: Call `projectRepository.createProject` and wait for it to finish and store its result in `project`.
            const project = await projectRepository.createProject(
                // Study: Start the object passed to the surrounding expression.
                {
                    // Study: Expand the values from `projectDataWithCover` into the surrounding collection.
                    ...projectDataWithCover,
                    // Study: Set the organization identifier used for this record or operation using `user.organizationId as string`.
                    organizationId: user.organizationId as string,
                // Study: End this group of values.
                },
                // Study: Supply `tx` to the surrounding statement.
                tx,
                // Study: Supply `imagesToSave` to the surrounding statement.
                imagesToSave
            // Study: End the list of information being sent to this step.
            );

            // Study: Call `projectCustomerRepository.createProjectCustomer` and wait for it to finish.
            await projectCustomerRepository.createProjectCustomer(
                // Study: Start the object passed to the surrounding expression.
                {
                    // Study: Set `projectId` to `project.id`.
                    projectId: project.id,
                    // Study: Carry the value of `customerId` into the new group under the same name.
                    customerId,
                    // Study: Set `relationshipType` to `"OWNER"`.
                    relationshipType: "OWNER",
                    // Study: Set `isPrimary` to `true`.
                    isPrimary: true,
                // Study: End this group of values.
                },
                // Study: Supply `tx` to the surrounding statement.
                tx
            // Study: End the list of information being sent to this step.
            );

            // Study: Give `project` back to the code that asked for it.
            return project;
        // Study: End this group of steps.
        });
    // Study: End this group of steps.
    }

    // Study: Give `await projectRepository.createProject({ ...projectDataWithCover, organizationId: us…` back to the code that asked for it.
    return await projectRepository.createProject({
        // Study: Expand the values from `projectDataWithCover` into the surrounding collection.
        ...projectDataWithCover,
        // Study: Set the organization identifier used for this record or operation using `user.organizationId`.
        organizationId: user.organizationId,
    // Study: Finish this group and continue the surrounding step.
    }, undefined, imagesToSave);
// Study: End this group of steps.
};

// get all project under organization
// Study: Make `getOrganizationProjects` available to other files. Its result arrives after its work finishes.
export const getOrganizationProjects = async (
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Do the next step if this check passes: `user.systemRole === "SUPER_ADMIN"`.
    if (user.systemRole === "SUPER_ADMIN") {
        // Study: Give `await projectRepository.findAllPlatformProjects()` back to the code that asked for it.
        return await projectRepository.findAllPlatformProjects();
    // Study: End this group of steps.
    }
    // Study: Do the next step if this check passes: `!user.organizationId`.
    if (!user.organizationId) {
        // Study: Stop here and report this problem: "This operation requires an organization context."
        throw new ForbiddenError("This operation requires an organization context.");
    // Study: End this group of steps.
    }

    // Study: Give `await projectRepository.findProjectsByOrganizationId( user.organizationId )` back to the code that asked for it.
    return await projectRepository.findProjectsByOrganizationId(
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: End the list of information being sent to this step.
    );
// Study: End this group of steps.
};

// get project by id
// Study: Make `getProjectById` available to other files. Its result arrives after its work finishes.
export const getProjectById = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Do the next step if this check passes: `user.systemRole === "SUPER_ADMIN"`.
    if (user.systemRole === "SUPER_ADMIN") {
        // Study: Call `projectRepository.findPlatformProjectById` and wait for it to finish and store its result in `project`.
        const project = await projectRepository.findPlatformProjectById(projectId);
        // Study: Do the next step if there is no value for `project` . If so, stop and report "Project not found."
        if (!project) throw new NotFoundError("Project not found.");
        // Study: Give `project` back to the code that asked for it.
        return project;
    // Study: End this group of steps.
    }
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

    // Study: Give `project` back to the code that asked for it.
    return project;
// Study: End this group of steps.
};

// update project
// Study: Make `updateProject` available to other files. Its result arrives after its work finishes.
export const updateProject = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
    // Study: This step receives `data`. `UpdateProjectInput` describes what that information should look like.
    data: UpdateProjectInput,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser,
    // Study: This step receives `images` as optional. `ProjectImageMutation[]` describes what that information should look like.
    images?: ProjectImageMutation[]
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

    // Study: Do the next step if this check passes: `images !== undefined`.
    if (images !== undefined) {
        // Study: Create an instance of `Set` and store the result as `currentImageIds`.
        const currentImageIds = new Set(project.images.map(image => image.id));
        // Study: Do the next step if this check passes: `images.some(image => image.id && !currentImageIds.has(image.id))`.
        if (images.some(image => image.id && !currentImageIds.has(image.id))) {
            // Study: Stop here and report this problem: "One or more selected images do not belong to this project."
            throw new BadRequestError("One or more selected images do not belong to this project.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Study: Set `resultingPlannedStartDate` to `data.plannedStartDate !== undefined ? data.plannedStartDate : project.plannedStartDate`.
    const resultingPlannedStartDate =
        // Study: Choose a value based on `data.plannedStartDate !== undefined`.
        data.plannedStartDate !== undefined
            // Study: Use this value if the check above passes.
            ? data.plannedStartDate
            // Study: Use this value if the check above fails.
            : project.plannedStartDate;

    // Study: Set `resultingPlannedEndDate` to `data.plannedEndDate !== undefined ? data.plannedEndDate : project.plannedEndDate`.
    const resultingPlannedEndDate =
        // Study: Choose a value based on `data.plannedEndDate !== undefined`.
        data.plannedEndDate !== undefined
            // Study: Use this value if the check above passes.
            ? data.plannedEndDate
            // Study: Use this value if the check above fails.
            : project.plannedEndDate;

    // Study: Do the next step if this check passes: `resultingPlannedStartDate !== null && resultingPlannedEndDate !== null`.
    if (resultingPlannedStartDate !== null && resultingPlannedEndDate !== null) {
        // Study: Do the next step if this check passes: `resultingPlannedEndDate < resultingPlannedStartDate`.
        if (resultingPlannedEndDate < resultingPlannedStartDate) {
            // Study: Stop here and report this problem: "Planned end date must be on or after planned start date."
            throw new BadRequestError("Planned end date must be on or after planned start date.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Study: Set `resultingActualStartDate` to `data.actualStartDate !== undefined ? data.actualStartDate : project.actualStartDate`.
    const resultingActualStartDate =
        // Study: Choose a value based on `data.actualStartDate !== undefined`.
        data.actualStartDate !== undefined
            // Study: Use this value if the check above passes.
            ? data.actualStartDate
            // Study: Use this value if the check above fails.
            : project.actualStartDate;

    // Study: Set `resultingActualEndDate` to `data.actualEndDate !== undefined ? data.actualEndDate : project.actualEndDate`.
    const resultingActualEndDate =
        // Study: Choose a value based on `data.actualEndDate !== undefined`.
        data.actualEndDate !== undefined
            // Study: Use this value if the check above passes.
            ? data.actualEndDate
            // Study: Use this value if the check above fails.
            : project.actualEndDate;

    // Study: Do the next step if this check passes: `resultingActualStartDate !== null && resultingActualEndDate !== null`.
    if (resultingActualStartDate !== null && resultingActualEndDate !== null) {
        // Study: Do the next step if this check passes: `resultingActualEndDate < resultingActualStartDate`.
        if (resultingActualEndDate < resultingActualStartDate) {
            // Study: Stop here and report this problem: "Actual end date must be on or after actual start date."
            throw new BadRequestError("Actual end date must be on or after actual start date.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Study: Call `projectRepository.updateProject` and wait for it to finish and store its result in `updatedProject`.
    const updatedProject = await projectRepository.updateProject(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `user` to the surrounding statement.
        user.organizationId,
        // Study: Supply `data` to the surrounding statement.
        data,
        // Study: Supply `images` to the surrounding statement.
        images
    // Study: End the list of information being sent to this step.
    );

    // Study: Do the next step if there is no value for `updatedProject`.
    if (!updatedProject) {
        // Study: Stop here and report this problem: "Project not found."
        throw new NotFoundError("Project not found.");
    // Study: End this group of steps.
    }

    // Study: Give `updatedProject` back to the code that asked for it.
    return updatedProject;
// Study: End this group of steps.
};

// delete project
// Study: Make `deleteProject` available to other files. Its result arrives after its work finishes.
export const deleteProject = async (
    // Study: This step receives `projectId`. `string` describes what that information should look like.
    projectId: string,
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

    // Study: Call `projectRepository.deleteProject` and wait for it to finish and store its result in `isDeleted`.
    const isDeleted = await projectRepository.deleteProject(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: End the list of information being sent to this step.
    );

    // Study: Do the next step if there is no value for `isDeleted`.
    if (!isDeleted) {
        // Study: Stop here and report this problem: "Project not found."
        throw new NotFoundError("Project not found.");
    // Study: End this group of steps.
    }

    // Study: Give `true` back to the code that asked for it.
    return true;
// Study: End this group of steps.
};
