// Study: This file is about which contractors work on which jobs and what they are responsible for. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `* as assignmentRepository` from `"./contractor-project-assignment.repository"` so this file can use it.
import * as assignmentRepository from "./contractor-project-assignment.repository";
// Study: Bring in `{ findContractorById }` from `"../contractor/contractor.repository"` so this file can use it.
import { findContractorById } from "../contractor/contractor.repository";
// Study: Bring in `{ findProjectByIdAndOrganization }` from `"../projects/project.repository"` so this file can use it.
import { findProjectByIdAndOrganization } from "../projects/project.repository";
// Study: Bring in `* as labourAssignmentRepository` from `"../labour-assignment/labour-assignment.repository"` so this file can use it.
import * as labourAssignmentRepository from "../labour-assignment/labour-assignment.repository";
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";
// Study: Bring in `{ CreateContractorProjectAssignmentBody, UpdateContractorProjectAssignmentBody }` from `"./contractor-project-assignment.types"` so this file can use it.
import { 
    // Study: Make `CreateContractorProjectAssignmentBody` from the other file available here.
    CreateContractorProjectAssignmentBody, 
    // Study: Make `UpdateContractorProjectAssignmentBody` from the other file available here.
    UpdateContractorProjectAssignmentBody 
// Study: Finish this group and continue the surrounding step.
} from "./contractor-project-assignment.types";
// Study: Bring in `{ NotFoundError }` from `"../../errors/NotFoundError"` so this file can use it.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Bring in `{ BadRequestError }` from `"../../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../../errors/BadRequestError";
// Study: Bring in `{ ConflictError }` from `"../../errors/ConflictError"` so this file can use it.
import { ConflictError } from "../../errors/ConflictError";
// Study: Bring in `{ ContractorStatus, ProjectStatus, ContractorAssignmentStatus }` from `"@prisma/client"` so this file can use it.
import { ContractorStatus, ProjectStatus, ContractorAssignmentStatus } from "@prisma/client";

// Study: Make `createAssignment` available to other files. Its result arrives after its work finishes.
export const createAssignment = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `data`. `CreateContractorProjectAssignmentBody` describes what that information should look like.
    data: CreateContractorProjectAssignmentBody
// Study: Finish this group and continue the surrounding step.
) => {
    // 1. Verify project ownership and status
    // Study: Call `findProjectByIdAndOrganization` and wait for it to finish and store its result in `project`.
    const project = await findProjectByIdAndOrganization(data.projectId, organizationId);
    // Study: Do the next step if there is no value for `project`.
    if (!project) {
        // Study: Stop here and report this problem: "Project not found in your organization."
        throw new NotFoundError("Project not found in your organization.");
    // Study: End this group of steps.
    }
    // Study: Do the next step if this check passes: `project.status !== ProjectStatus.PLANNING && project.status !== ProjectStatus.ACTIVE`.
    if (project.status !== ProjectStatus.PLANNING && project.status !== ProjectStatus.ACTIVE) {
        // Study: Stop here and pass the problem onward: `new BadRequestError('Cannot assign contractor to a project with status: ${project.s…`.
        throw new BadRequestError(`Cannot assign contractor to a project with status: ${project.status}`);
    // Study: End this group of steps.
    }

    // 2. Verify contractor ownership and status
    // Study: Call `findContractorById` and wait for it to finish and store its result in `contractor`.
    const contractor = await findContractorById(data.contractorId, organizationId);
    // Study: Do the next step if there is no value for `contractor`.
    if (!contractor) {
        // Study: Stop here and report this problem: "Contractor not found in your organization."
        throw new NotFoundError("Contractor not found in your organization.");
    // Study: End this group of steps.
    }
    // Study: Do the next step if this check passes: `contractor.status !== ContractorStatus.ACTIVE`.
    if (contractor.status !== ContractorStatus.ACTIVE) {
        // Study: Stop here and pass the problem onward: `new BadRequestError('Cannot assign an inactive contractor. Current status: ${contra…`.
        throw new BadRequestError(`Cannot assign an inactive contractor. Current status: ${contractor.status}`);
    // Study: End this group of steps.
    }

    // 3. Duplicate assignment check
    // Study: Call `assignmentRepository.findByProjectAndContractor` and wait for it to finish and store its result in `existingAssignment`.
    const existingAssignment = await assignmentRepository.findByProjectAndContractor(data.projectId, data.contractorId);
    // Study: Do the next step if this check passes: `existingAssignment`.
    if (existingAssignment) {
        // Study: Stop here and report this problem: "This contractor is already assigned to this project."
        throw new ConflictError("This contractor is already assigned to this project.");
    // Study: End this group of steps.
    }

    // 4. Responsibility validation
    // Study: Do the next step if this check passes: `data.responsibilityIds && data.responsibilityIds.length > 0`.
    if (data.responsibilityIds && data.responsibilityIds.length > 0) {
        // Study: Find all matching records using `prisma.responsibility` and wait for it to finish and store its result in `responsibilities`.
        const responsibilities = await prisma.responsibility.findMany({
            // Study: Set the conditions that records must meet using id.
            where: { id: { in: data.responsibilityIds } },
        // Study: End this group of values.
        });

        // Study: Do the next step if this check passes: `responsibilities.length !== data.responsibilityIds.length`.
        if (responsibilities.length !== data.responsibilityIds.length) {
            // Study: Stop here and report this problem: "One or more responsibilities do not exist."
            throw new BadRequestError("One or more responsibilities do not exist.");
        // Study: End this group of steps.
        }

        // Study: Keep the items in `responsibilities` that satisfy the predicate and store the result as `inactiveResponsibilities`.
        const inactiveResponsibilities = responsibilities.filter(r => !r.isActive);
        // Study: Do the next step if this check passes: `inactiveResponsibilities.length > 0`.
        if (inactiveResponsibilities.length > 0) {
            // Study: Stop here and report this problem: "One or more responsibilities are inactive."
            throw new BadRequestError("One or more responsibilities are inactive.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // 5. Date validation
    // Study: Do the next step if this check passes: `data.startDate && data.endDate`.
    if (data.startDate && data.endDate) {
        // Study: Do the next step if this check passes: `data.endDate < data.startDate`.
        if (data.endDate < data.startDate) {
            // Study: Stop here and report this problem: "End date cannot be before start date."
            throw new BadRequestError("End date cannot be before start date.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // 6. Create Assignment
    // Study: Give `await assignmentRepository.create({ projectId: data.projectId, contractorId: data.c…` back to the code that asked for it.
    return await assignmentRepository.create({
        // Study: Set `projectId` to `data.projectId`.
        projectId: data.projectId,
        // Study: Set `contractorId` to `data.contractorId`.
        contractorId: data.contractorId,
        // Study: Set `scopeDescription` to `data.scopeDescription`.
        scopeDescription: data.scopeDescription,
        // Study: Set `startDate` to `data.startDate`.
        startDate: data.startDate,
        // Study: Set `endDate` to `data.endDate`.
        endDate: data.endDate,
        // Study: Set `notes` to `data.notes`.
        notes: data.notes,
        // Study: Set `responsibilityIds` to `data.responsibilityIds`.
        responsibilityIds: data.responsibilityIds,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `getAssignmentById` available to other files. Its result arrives after its work finishes.
export const getAssignmentById = async (organizationId: string, assignmentId: string) => {
    // Study: Call `assignmentRepository.findById` and wait for it to finish and store its result in `assignment`.
    const assignment = await assignmentRepository.findById(assignmentId);
    // Study: Do the next step if there is no value for `assignment`.
    if (!assignment) {
        // Study: Stop here and report this problem: "Assignment not found."
        throw new NotFoundError("Assignment not found.");
    // Study: End this group of steps.
    }
    
    // Study: Do the next step if this check passes: `assignment.project.organizationId !== organizationId`.
    if (assignment.project.organizationId !== organizationId) {
        // Study: Stop here and report this problem: "Assignment not found."
        throw new NotFoundError("Assignment not found.");
    // Study: End this group of steps.
    }

    // Study: Give `assignment` back to the code that asked for it.
    return assignment;
// Study: End this group of steps.
};

// Study: Make `getPlatformAssignmentById` available to other files. Its result arrives after its work finishes.
export const getPlatformAssignmentById = async (assignmentId: string) => {
    // Study: Call `assignmentRepository.findById` and wait for it to finish and store its result in `assignment`.
    const assignment = await assignmentRepository.findById(assignmentId);
    // Study: Do the next step if there is no value for `assignment` . If so, stop and report "Assignment not found."
    if (!assignment) throw new NotFoundError("Assignment not found.");
    // Study: Give `assignment` back to the code that asked for it.
    return assignment;
// Study: End this group of steps.
};

// Study: Make `getAssignments` available to other files. Its result arrives after its work finishes.
export const getAssignments = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `filters`. `{ projectId?: string; contractorId?: string; status?: ContractorAssignmentStatus; }` describes what that information should look like.
    filters: {
        // Study: Define `projectId` as optional with type `string`.
        projectId?: string;
        // Study: Define `contractorId` as optional with type `string`.
        contractorId?: string;
        // Study: Define `status` as optional with type `ContractorAssignmentStatus`.
        status?: ContractorAssignmentStatus;
    // Study: Close the object type.
    }
// Study: Finish this group and continue the surrounding step.
) => {
    // Validate project filter tenant
    // Study: Do the next step if this check passes: `filters.projectId`.
    if (filters.projectId) {
        // Study: Call `findProjectByIdAndOrganization` and wait for it to finish and store its result in `project`.
        const project = await findProjectByIdAndOrganization(filters.projectId, organizationId);
        // Study: Do the next step if there is no value for `project`.
        if (!project) {
            // Study: Stop here and report this problem: "Project not found in your organization."
            throw new NotFoundError("Project not found in your organization.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Validate contractor filter tenant
    // Study: Do the next step if this check passes: `filters.contractorId`.
    if (filters.contractorId) {
        // Study: Call `findContractorById` and wait for it to finish and store its result in `contractor`.
        const contractor = await findContractorById(filters.contractorId, organizationId);
        // Study: Do the next step if there is no value for `contractor`.
        if (!contractor) {
            // Study: Stop here and report this problem: "Contractor not found in your organization."
            throw new NotFoundError("Contractor not found in your organization.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Study: Call `assignmentRepository.findMany` and wait for it to finish and store its result in `assignments`.
    const assignments = await assignmentRepository.findMany(organizationId, filters);
    
    // Study: Give `assignments` back to the code that asked for it.
    return assignments;
// Study: End this group of steps.
};

// Study: Make `getPlatformAssignments` available to other files. Its result arrives after its work finishes.
export const getPlatformAssignments = async (filters: {
    // Study: Define `projectId` as optional with type `string`.
    projectId?: string;
    // Study: Define `contractorId` as optional with type `string`.
    contractorId?: string;
    // Study: Define `status` as optional with type `ContractorAssignmentStatus`.
    status?: ContractorAssignmentStatus;
// Study: Call `assignmentRepository.findAllPlatform`.
}) => assignmentRepository.findAllPlatform(filters);

// Study: Make `updateAssignment` available to other files. Its result arrives after its work finishes.
export const updateAssignment = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `assignmentId`. `string` describes what that information should look like.
    assignmentId: string,
    // Study: This step receives `data`. `UpdateContractorProjectAssignmentBody` describes what that information should look like.
    data: UpdateContractorProjectAssignmentBody
// Study: Finish this group and continue the surrounding step.
) => {
    // 1. Fetch assignment and verify tenant
    // Study: Call `assignmentRepository.findById` and wait for it to finish and store its result in `assignment`.
    const assignment = await assignmentRepository.findById(assignmentId);
    // Study: Do the next step if there is no value for `assignment`.
    if (!assignment) {
        // Study: Stop here and report this problem: "Assignment not found."
        throw new NotFoundError("Assignment not found.");
    // Study: End this group of steps.
    }
    
    // Study: Do the next step if this check passes: `assignment.project.organizationId !== organizationId`.
    if (assignment.project.organizationId !== organizationId) {
        // Study: Stop here and report this problem: "Assignment not found."
        throw new NotFoundError("Assignment not found.");
    // Study: End this group of steps.
    }

    // 2. Responsibility validation
    // Study: Do the next step if this check passes: `data.responsibilityIds && data.responsibilityIds.length > 0`.
    if (data.responsibilityIds && data.responsibilityIds.length > 0) {
        // Study: Find all matching records using `prisma.responsibility` and wait for it to finish and store its result in `responsibilities`.
        const responsibilities = await prisma.responsibility.findMany({
            // Study: Set the conditions that records must meet using id.
            where: { id: { in: data.responsibilityIds } },
        // Study: End this group of values.
        });

        // Study: Do the next step if this check passes: `responsibilities.length !== data.responsibilityIds.length`.
        if (responsibilities.length !== data.responsibilityIds.length) {
            // Study: Stop here and report this problem: "One or more responsibilities do not exist."
            throw new BadRequestError("One or more responsibilities do not exist.");
        // Study: End this group of steps.
        }

        // Study: Keep the items in `responsibilities` that satisfy the predicate and store the result as `inactiveResponsibilities`.
        const inactiveResponsibilities = responsibilities.filter(r => !r.isActive);
        // Study: Do the next step if this check passes: `inactiveResponsibilities.length > 0`.
        if (inactiveResponsibilities.length > 0) {
            // Study: Stop here and report this problem: "One or more responsibilities are inactive."
            throw new BadRequestError("One or more responsibilities are inactive.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // 3. Date validation
    // Study: Set `resultingStartDate` to `data.startDate !== undefined ? data.startDate : assignment.startDate`.
    const resultingStartDate = data.startDate !== undefined ? data.startDate : assignment.startDate;
    // Study: Set `resultingEndDate` to `data.endDate !== undefined ? data.endDate : assignment.endDate`.
    const resultingEndDate = data.endDate !== undefined ? data.endDate : assignment.endDate;

    // Study: Do the next step if this check passes: `resultingStartDate !== null && resultingEndDate !== null`.
    if (resultingStartDate !== null && resultingEndDate !== null) {
        // Study: Do the next step if this check passes: `resultingEndDate < resultingStartDate`.
        if (resultingEndDate < resultingStartDate) {
            // Study: Stop here and report this problem: "Resulting end date cannot be before start date."
            throw new BadRequestError("Resulting end date cannot be before start date.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `data.startDate !== undefined || data.endDate !== undefined`.
    if (data.startDate !== undefined || data.endDate !== undefined) {
        // Study: Call `labourAssignmentRepository.findMany` and wait for it to finish and store its result in `childLabourAssignments`.
        const childLabourAssignments = await labourAssignmentRepository.findMany(organizationId, {
            // Study: Set `contractorProjectAssignmentId` to `assignmentId`.
            contractorProjectAssignmentId: assignmentId,
        // Study: End this group of values.
        });

        // Study: Iterate over each item from `childLabourAssignments` using `const la`.
        for (const la of childLabourAssignments) {
            // Study: Do the next step if this check passes: `resultingStartDate !== null && la.startDate < resultingStartDate`.
            if (resultingStartDate !== null && la.startDate < resultingStartDate) {
                // Study: Stop here and pass the problem onward: `new ConflictError("Contractor project assignment dates cannot be changed because th…`.
                throw new ConflictError("Contractor project assignment dates cannot be changed because they would invalidate existing labour assignments.");
            // Study: End this group of steps.
            }
            // Study: Do the next step if this check passes: `resultingEndDate !== null && la.endDate > resultingEndDate`.
            if (resultingEndDate !== null && la.endDate > resultingEndDate) {
                // Study: Stop here and pass the problem onward: `new ConflictError("Contractor project assignment dates cannot be changed because th…`.
                throw new ConflictError("Contractor project assignment dates cannot be changed because they would invalidate existing labour assignments.");
            // Study: End this group of steps.
            }
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }


    // Study: Do the next step if this check passes: `data.status !== undefined && data.status !== assignment.status`.
    if (data.status !== undefined && data.status !== assignment.status) {
        // Study: Set `currentStatus` to `assignment.status`.
        const currentStatus = assignment.status;
        // Study: Set `requestedStatus` to `data.status`.
        const requestedStatus = data.status;

        // Study: Build the object `allowedTransitions` with the entries below.
        const allowedTransitions: Record<ContractorAssignmentStatus, ContractorAssignmentStatus[]> = {
            // Study: Start the nested value for `[ContractorAssignmentStatus.PENDING]`.
            [ContractorAssignmentStatus.PENDING]: [ContractorAssignmentStatus.ACTIVE, ContractorAssignmentStatus.CANCELLED],
            // Study: Start the nested value for `[ContractorAssignmentStatus.ACTIVE]`.
            [ContractorAssignmentStatus.ACTIVE]: [ContractorAssignmentStatus.ON_HOLD, ContractorAssignmentStatus.COMPLETED, ContractorAssignmentStatus.TERMINATED],
            // Study: Start the nested value for `[ContractorAssignmentStatus.ON_HOLD]`.
            [ContractorAssignmentStatus.ON_HOLD]: [ContractorAssignmentStatus.ACTIVE],
            // Study: Start the nested value for `[ContractorAssignmentStatus.COMPLETED]`.
            [ContractorAssignmentStatus.COMPLETED]: [],
            // Study: Start the nested value for `[ContractorAssignmentStatus.CANCELLED]`.
            [ContractorAssignmentStatus.CANCELLED]: [],
            // Study: Start the nested value for `[ContractorAssignmentStatus.TERMINATED]`.
            [ContractorAssignmentStatus.TERMINATED]: [],
        // Study: End this group of values.
        };

        // Study: Do the next step if this check passes: `!allowedTransitions[currentStatus].includes(requestedStatus)`.
        if (!allowedTransitions[currentStatus].includes(requestedStatus)) {
            // Study: Stop here and pass the problem onward: `new BadRequestError('Cannot change assignment status from ${currentStatus} to ${req…`.
            throw new BadRequestError(`Cannot change assignment status from ${currentStatus} to ${requestedStatus}.`);
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Study: Set `cancelActiveLabourAssignments` to `false`.
    let cancelActiveLabourAssignments = false;
    // Study: Do the next step if this check passes: `data.status !== undefined && data.status !== assignment.status`.
    if (data.status !== undefined && data.status !== assignment.status) {
        // Study: Do the next step if this check passes: `data.status === ContractorAssignmentStatus.COMPLETED || data.status === ContractorA…`.
        if (
            // Study: Evaluate `data.status === ContractorAssignmentStatus.COMPLETED || data.status === ContractorA…`.
            data.status === ContractorAssignmentStatus.COMPLETED ||
            // Study: Evaluate `data.status === ContractorAssignmentStatus.TERMINATED`.
            data.status === ContractorAssignmentStatus.TERMINATED ||
            // Study: Evaluate `data.status === ContractorAssignmentStatus.CANCELLED`.
            data.status === ContractorAssignmentStatus.CANCELLED
        // Study: Finish this group and continue the surrounding step.
        ) {
            // Study: Assign `true` to `cancelActiveLabourAssignments`.
            cancelActiveLabourAssignments = true;
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // 4. Execute Update
    // Study: Give `await assignmentRepository.update(assignmentId, { scopeDescription: data.scopeDescr…` back to the code that asked for it.
    return await assignmentRepository.update(assignmentId, {
        // Study: Set `scopeDescription` to `data.scopeDescription`.
        scopeDescription: data.scopeDescription,
        // Study: Set `startDate` to `data.startDate`.
        startDate: data.startDate,
        // Study: Set `endDate` to `data.endDate`.
        endDate: data.endDate,
        // Study: Set `notes` to `data.notes`.
        notes: data.notes,
        // Study: Set `status` to `data.status`.
        status: data.status,
        // Study: Set `responsibilityIds` to `data.responsibilityIds`.
        responsibilityIds: data.responsibilityIds,
        // Study: Carry the value of `cancelActiveLabourAssignments` into the new group under the same name.
        cancelActiveLabourAssignments,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};
