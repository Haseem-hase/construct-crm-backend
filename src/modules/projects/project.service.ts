// Study: Apply business rules and coordinate database operations for construction projects, their site details, and image galleries.
// Study: Import `* as projectRepository` from `"./project.repository"`.
import * as projectRepository from "./project.repository";
// Study: Import `* as projectCustomerRepository` from `"../project-customer/project-customer.repository"`.
import * as projectCustomerRepository from "../project-customer/project-customer.repository";
// Study: Import `* as customerRepository` from `"../customers/customer.repository"`.
import * as customerRepository from "../customers/customer.repository";
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";
// Study: Import `{ CreateProjectInput, ProjectImageMutation, UpdateProjectInput }` from `"./project.types"`.
import { CreateProjectInput, ProjectImageMutation, UpdateProjectInput } from "./project.types";
// Study: Import `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"`.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Import `{ ForbiddenError }` from `"../../errors/ForbiddenError"`.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Import `{ NotFoundError }` from `"../../errors/NotFoundError"`.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Import `{ BadRequestError }` from `"../../errors/BadRequestError"`.
import { BadRequestError } from "../../errors/BadRequestError";

// create project
// Study: Export `createProject` as an async function that returns a promise.
export const createProject = async (
    // Study: Accept `data` with type `CreateProjectInput`.
    data: CreateProjectInput,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser,
    // Study: Accept `images` as optional with type `ProjectImageMutation[]`.
    images?: ProjectImageMutation[]
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run the following branch when `!user.organizationId` is truthy.
    if (!user.organizationId) {
        // Study: Stop this execution path by throwing `new ForbiddenError("This operation requires an organization context.")`.
        throw new ForbiddenError("This operation requires an organization context.");
    // Study: Close the code block.
    }

    // Study: Set `{ customerId, ...projectData }` to `data`.
    const { customerId, ...projectData } = data;
    // Study: Set `imagesToSave` to `images ?? (data.imageUrl ? [{ imageUrl: data.imageUrl, alt: data.name, isCover: tru…`.
    const imagesToSave = images ?? (data.imageUrl ? [{ imageUrl: data.imageUrl, alt: data.name, isCover: true }] : []);
    // Study: Find the first matching item in `imagesToSave` and store the result as `coverImage`.
    const coverImage = imagesToSave.find(image => image.isCover);
    // Study: Build the object `projectDataWithCover` with the entries below.
    const projectDataWithCover = { ...projectData, ...(images !== undefined ? { imageUrl: coverImage?.imageUrl } : {}) };

    // Study: Run the following branch when `customerId` is truthy.
    if (customerId) {
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

        // Study: Return `await prisma.$transaction(async (tx) => { const project = await projectRepository.c…` to the caller.
        return await prisma.$transaction(async (tx) => {
            // Study: Call `projectRepository.createProject` and wait for it to finish and store its result in `project`.
            const project = await projectRepository.createProject(
                // Study: Start the object passed to the surrounding expression.
                {
                    // Study: Expand the values from `projectDataWithCover` into the surrounding collection.
                    ...projectDataWithCover,
                    // Study: Set the organization identifier used for this record or operation using `user.organizationId as string`.
                    organizationId: user.organizationId as string,
                // Study: Close the object literal.
                },
                // Study: Supply `tx` to the surrounding statement.
                tx,
                // Study: Supply `imagesToSave` to the surrounding statement.
                imagesToSave
            // Study: Close the call arguments.
            );

            // Study: Call `projectCustomerRepository.createProjectCustomer` and wait for it to finish.
            await projectCustomerRepository.createProjectCustomer(
                // Study: Start the object passed to the surrounding expression.
                {
                    // Study: Set `projectId` to `project.id`.
                    projectId: project.id,
                    // Study: Pass the current `customerId` value under the same property name.
                    customerId,
                    // Study: Set `relationshipType` to `"OWNER"`.
                    relationshipType: "OWNER",
                    // Study: Set `isPrimary` to `true`.
                    isPrimary: true,
                // Study: Close the object literal.
                },
                // Study: Supply `tx` to the surrounding statement.
                tx
            // Study: Close the call arguments.
            );

            // Study: Return `project` to the caller.
            return project;
        // Study: Close the code block.
        });
    // Study: Close the code block.
    }

    // Study: Return `await projectRepository.createProject({ ...projectDataWithCover, organizationId: us…` to the caller.
    return await projectRepository.createProject({
        // Study: Expand the values from `projectDataWithCover` into the surrounding collection.
        ...projectDataWithCover,
        // Study: Set the organization identifier used for this record or operation using `user.organizationId`.
        organizationId: user.organizationId,
    // Study: Close this group and continue the enclosing expression.
    }, undefined, imagesToSave);
// Study: Close the code block.
};

// get all project under organization
// Study: Export `getOrganizationProjects` as an async function that returns a promise.
export const getOrganizationProjects = async (
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run the following branch when `user.systemRole === "SUPER_ADMIN"` is truthy.
    if (user.systemRole === "SUPER_ADMIN") {
        // Study: Return `await projectRepository.findAllPlatformProjects()` to the caller.
        return await projectRepository.findAllPlatformProjects();
    // Study: Close the code block.
    }
    // Study: Run the following branch when `!user.organizationId` is truthy.
    if (!user.organizationId) {
        // Study: Stop this execution path by throwing `new ForbiddenError("This operation requires an organization context.")`.
        throw new ForbiddenError("This operation requires an organization context.");
    // Study: Close the code block.
    }

    // Study: Return `await projectRepository.findProjectsByOrganizationId( user.organizationId )` to the caller.
    return await projectRepository.findProjectsByOrganizationId(
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: Close the call arguments.
    );
// Study: Close the code block.
};

// get project by id
// Study: Export `getProjectById` as an async function that returns a promise.
export const getProjectById = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run the following branch when `user.systemRole === "SUPER_ADMIN"` is truthy.
    if (user.systemRole === "SUPER_ADMIN") {
        // Study: Call `projectRepository.findPlatformProjectById` and wait for it to finish and store its result in `project`.
        const project = await projectRepository.findPlatformProjectById(projectId);
        // Study: Run the following branch when `!project` is truthy and throw `new NotFoundError("Project not found.")`.
        if (!project) throw new NotFoundError("Project not found.");
        // Study: Return `project` to the caller.
        return project;
    // Study: Close the code block.
    }
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

    // Study: Return `project` to the caller.
    return project;
// Study: Close the code block.
};

// update project
// Study: Export `updateProject` as an async function that returns a promise.
export const updateProject = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
    // Study: Accept `data` with type `UpdateProjectInput`.
    data: UpdateProjectInput,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser,
    // Study: Accept `images` as optional with type `ProjectImageMutation[]`.
    images?: ProjectImageMutation[]
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

    // Study: Run the following branch when `images !== undefined` is truthy.
    if (images !== undefined) {
        // Study: Create an instance of `Set` and store the result as `currentImageIds`.
        const currentImageIds = new Set(project.images.map(image => image.id));
        // Study: Run the following branch when `images.some(image => image.id && !currentImageIds.has(image.id))` is truthy.
        if (images.some(image => image.id && !currentImageIds.has(image.id))) {
            // Study: Stop this execution path by throwing `new BadRequestError("One or more selected images do not belong to this project.")`.
            throw new BadRequestError("One or more selected images do not belong to this project.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Study: Set `resultingPlannedStartDate` to `data.plannedStartDate !== undefined ? data.plannedStartDate : project.plannedStartDate`.
    const resultingPlannedStartDate =
        // Study: Choose a value based on `data.plannedStartDate !== undefined`.
        data.plannedStartDate !== undefined
            // Study: Use this value when the preceding condition is truthy.
            ? data.plannedStartDate
            // Study: Use this value when the preceding condition is falsy.
            : project.plannedStartDate;

    // Study: Set `resultingPlannedEndDate` to `data.plannedEndDate !== undefined ? data.plannedEndDate : project.plannedEndDate`.
    const resultingPlannedEndDate =
        // Study: Choose a value based on `data.plannedEndDate !== undefined`.
        data.plannedEndDate !== undefined
            // Study: Use this value when the preceding condition is truthy.
            ? data.plannedEndDate
            // Study: Use this value when the preceding condition is falsy.
            : project.plannedEndDate;

    // Study: Run the following branch when `resultingPlannedStartDate !== null && resultingPlannedEndDate !== null` is truthy.
    if (resultingPlannedStartDate !== null && resultingPlannedEndDate !== null) {
        // Study: Run the following branch when `resultingPlannedEndDate < resultingPlannedStartDate` is truthy.
        if (resultingPlannedEndDate < resultingPlannedStartDate) {
            // Study: Stop this execution path by throwing `new BadRequestError("Planned end date must be on or after planned start date.")`.
            throw new BadRequestError("Planned end date must be on or after planned start date.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Study: Set `resultingActualStartDate` to `data.actualStartDate !== undefined ? data.actualStartDate : project.actualStartDate`.
    const resultingActualStartDate =
        // Study: Choose a value based on `data.actualStartDate !== undefined`.
        data.actualStartDate !== undefined
            // Study: Use this value when the preceding condition is truthy.
            ? data.actualStartDate
            // Study: Use this value when the preceding condition is falsy.
            : project.actualStartDate;

    // Study: Set `resultingActualEndDate` to `data.actualEndDate !== undefined ? data.actualEndDate : project.actualEndDate`.
    const resultingActualEndDate =
        // Study: Choose a value based on `data.actualEndDate !== undefined`.
        data.actualEndDate !== undefined
            // Study: Use this value when the preceding condition is truthy.
            ? data.actualEndDate
            // Study: Use this value when the preceding condition is falsy.
            : project.actualEndDate;

    // Study: Run the following branch when `resultingActualStartDate !== null && resultingActualEndDate !== null` is truthy.
    if (resultingActualStartDate !== null && resultingActualEndDate !== null) {
        // Study: Run the following branch when `resultingActualEndDate < resultingActualStartDate` is truthy.
        if (resultingActualEndDate < resultingActualStartDate) {
            // Study: Stop this execution path by throwing `new BadRequestError("Actual end date must be on or after actual start date.")`.
            throw new BadRequestError("Actual end date must be on or after actual start date.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
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
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `!updatedProject` is truthy.
    if (!updatedProject) {
        // Study: Stop this execution path by throwing `new NotFoundError("Project not found.")`.
        throw new NotFoundError("Project not found.");
    // Study: Close the code block.
    }

    // Study: Return `updatedProject` to the caller.
    return updatedProject;
// Study: Close the code block.
};

// delete project
// Study: Export `deleteProject` as an async function that returns a promise.
export const deleteProject = async (
    // Study: Accept `projectId` with type `string`.
    projectId: string,
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

    // Study: Call `projectRepository.deleteProject` and wait for it to finish and store its result in `isDeleted`.
    const isDeleted = await projectRepository.deleteProject(
        // Study: Supply `projectId` to the surrounding statement.
        projectId,
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `!isDeleted` is truthy.
    if (!isDeleted) {
        // Study: Stop this execution path by throwing `new NotFoundError("Project not found.")`.
        throw new NotFoundError("Project not found.");
    // Study: Close the code block.
    }

    // Study: Return `true` to the caller.
    return true;
// Study: Close the code block.
};
