// Study: Apply business rules and coordinate database operations for contractor placements on projects and their responsibilities.
// Study: Import `* as assignmentRepository` from `"./contractor-project-assignment.repository"`.
import * as assignmentRepository from "./contractor-project-assignment.repository";
// Study: Import `{ findContractorById }` from `"../contractor/contractor.repository"`.
import { findContractorById } from "../contractor/contractor.repository";
// Study: Import `{ findProjectByIdAndOrganization }` from `"../projects/project.repository"`.
import { findProjectByIdAndOrganization } from "../projects/project.repository";
// Study: Import `* as labourAssignmentRepository` from `"../labour-assignment/labour-assignment.repository"`.
import * as labourAssignmentRepository from "../labour-assignment/labour-assignment.repository";
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";
// Study: Import `{ CreateContractorProjectAssignmentBody, UpdateContractorProjectAssignmentBody }` from `"./contractor-project-assignment.types"`.
import { 
    // Study: Bring `CreateContractorProjectAssignmentBody` into scope from the imported module.
    CreateContractorProjectAssignmentBody, 
    // Study: Bring `UpdateContractorProjectAssignmentBody` into scope from the imported module.
    UpdateContractorProjectAssignmentBody 
// Study: Close this group and continue the enclosing expression.
} from "./contractor-project-assignment.types";
// Study: Import `{ NotFoundError }` from `"../../errors/NotFoundError"`.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Import `{ BadRequestError }` from `"../../errors/BadRequestError"`.
import { BadRequestError } from "../../errors/BadRequestError";
// Study: Import `{ ConflictError }` from `"../../errors/ConflictError"`.
import { ConflictError } from "../../errors/ConflictError";
// Study: Import `{ ContractorStatus, ProjectStatus, ContractorAssignmentStatus }` from `"@prisma/client"`.
import { ContractorStatus, ProjectStatus, ContractorAssignmentStatus } from "@prisma/client";

// Study: Export `createAssignment` as an async function that returns a promise.
export const createAssignment = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `data` with type `CreateContractorProjectAssignmentBody`.
    data: CreateContractorProjectAssignmentBody
// Study: Close this group and continue the enclosing expression.
) => {
    // 1. Verify project ownership and status
    // Study: Call `findProjectByIdAndOrganization` and wait for it to finish and store its result in `project`.
    const project = await findProjectByIdAndOrganization(data.projectId, organizationId);
    // Study: Run the following branch when `!project` is truthy.
    if (!project) {
        // Study: Stop this execution path by throwing `new NotFoundError("Project not found in your organization.")`.
        throw new NotFoundError("Project not found in your organization.");
    // Study: Close the code block.
    }
    // Study: Run the following branch when `project.status !== ProjectStatus.PLANNING && project.status !== ProjectStatus.ACTIVE` is truthy.
    if (project.status !== ProjectStatus.PLANNING && project.status !== ProjectStatus.ACTIVE) {
        // Study: Stop this execution path by throwing `new BadRequestError('Cannot assign contractor to a project with status: ${project.s…`.
        throw new BadRequestError(`Cannot assign contractor to a project with status: ${project.status}`);
    // Study: Close the code block.
    }

    // 2. Verify contractor ownership and status
    // Study: Call `findContractorById` and wait for it to finish and store its result in `contractor`.
    const contractor = await findContractorById(data.contractorId, organizationId);
    // Study: Run the following branch when `!contractor` is truthy.
    if (!contractor) {
        // Study: Stop this execution path by throwing `new NotFoundError("Contractor not found in your organization.")`.
        throw new NotFoundError("Contractor not found in your organization.");
    // Study: Close the code block.
    }
    // Study: Run the following branch when `contractor.status !== ContractorStatus.ACTIVE` is truthy.
    if (contractor.status !== ContractorStatus.ACTIVE) {
        // Study: Stop this execution path by throwing `new BadRequestError('Cannot assign an inactive contractor. Current status: ${contra…`.
        throw new BadRequestError(`Cannot assign an inactive contractor. Current status: ${contractor.status}`);
    // Study: Close the code block.
    }

    // 3. Duplicate assignment check
    // Study: Call `assignmentRepository.findByProjectAndContractor` and wait for it to finish and store its result in `existingAssignment`.
    const existingAssignment = await assignmentRepository.findByProjectAndContractor(data.projectId, data.contractorId);
    // Study: Run the following branch when `existingAssignment` is truthy.
    if (existingAssignment) {
        // Study: Stop this execution path by throwing `new ConflictError("This contractor is already assigned to this project.")`.
        throw new ConflictError("This contractor is already assigned to this project.");
    // Study: Close the code block.
    }

    // 4. Responsibility validation
    // Study: Run the following branch when `data.responsibilityIds && data.responsibilityIds.length > 0` is truthy.
    if (data.responsibilityIds && data.responsibilityIds.length > 0) {
        // Study: Fetch records matching the query through `prisma.responsibility` and wait for it to finish and store its result in `responsibilities`.
        const responsibilities = await prisma.responsibility.findMany({
            // Study: Set the conditions that database records must match using id.
            where: { id: { in: data.responsibilityIds } },
        // Study: Close the object literal.
        });

        // Study: Run the following branch when `responsibilities.length !== data.responsibilityIds.length` is truthy.
        if (responsibilities.length !== data.responsibilityIds.length) {
            // Study: Stop this execution path by throwing `new BadRequestError("One or more responsibilities do not exist.")`.
            throw new BadRequestError("One or more responsibilities do not exist.");
        // Study: Close the code block.
        }

        // Study: Keep the items in `responsibilities` that satisfy the predicate and store the result as `inactiveResponsibilities`.
        const inactiveResponsibilities = responsibilities.filter(r => !r.isActive);
        // Study: Run the following branch when `inactiveResponsibilities.length > 0` is truthy.
        if (inactiveResponsibilities.length > 0) {
            // Study: Stop this execution path by throwing `new BadRequestError("One or more responsibilities are inactive.")`.
            throw new BadRequestError("One or more responsibilities are inactive.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // 5. Date validation
    // Study: Run the following branch when `data.startDate && data.endDate` is truthy.
    if (data.startDate && data.endDate) {
        // Study: Run the following branch when `data.endDate < data.startDate` is truthy.
        if (data.endDate < data.startDate) {
            // Study: Stop this execution path by throwing `new BadRequestError("End date cannot be before start date.")`.
            throw new BadRequestError("End date cannot be before start date.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // 6. Create Assignment
    // Study: Return `await assignmentRepository.create({ projectId: data.projectId, contractorId: data.c…` to the caller.
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
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `getAssignmentById` as an async function that returns a promise.
export const getAssignmentById = async (organizationId: string, assignmentId: string) => {
    // Study: Call `assignmentRepository.findById` and wait for it to finish and store its result in `assignment`.
    const assignment = await assignmentRepository.findById(assignmentId);
    // Study: Run the following branch when `!assignment` is truthy.
    if (!assignment) {
        // Study: Stop this execution path by throwing `new NotFoundError("Assignment not found.")`.
        throw new NotFoundError("Assignment not found.");
    // Study: Close the code block.
    }
    
    // Study: Run the following branch when `assignment.project.organizationId !== organizationId` is truthy.
    if (assignment.project.organizationId !== organizationId) {
        // Study: Stop this execution path by throwing `new NotFoundError("Assignment not found.")`.
        throw new NotFoundError("Assignment not found.");
    // Study: Close the code block.
    }

    // Study: Return `assignment` to the caller.
    return assignment;
// Study: Close the code block.
};

// Study: Export `getPlatformAssignmentById` as an async function that returns a promise.
export const getPlatformAssignmentById = async (assignmentId: string) => {
    // Study: Call `assignmentRepository.findById` and wait for it to finish and store its result in `assignment`.
    const assignment = await assignmentRepository.findById(assignmentId);
    // Study: Run the following branch when `!assignment` is truthy and throw `new NotFoundError("Assignment not found.")`.
    if (!assignment) throw new NotFoundError("Assignment not found.");
    // Study: Return `assignment` to the caller.
    return assignment;
// Study: Close the code block.
};

// Study: Export `getAssignments` as an async function that returns a promise.
export const getAssignments = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `filters` with type `{ projectId?: string; contractorId?: string; status?: ContractorAssignmentStatus; }`.
    filters: {
        // Study: Define `projectId` as optional with type `string`.
        projectId?: string;
        // Study: Define `contractorId` as optional with type `string`.
        contractorId?: string;
        // Study: Define `status` as optional with type `ContractorAssignmentStatus`.
        status?: ContractorAssignmentStatus;
    // Study: Close the object type.
    }
// Study: Close this group and continue the enclosing expression.
) => {
    // Validate project filter tenant
    // Study: Run the following branch when `filters.projectId` is truthy.
    if (filters.projectId) {
        // Study: Call `findProjectByIdAndOrganization` and wait for it to finish and store its result in `project`.
        const project = await findProjectByIdAndOrganization(filters.projectId, organizationId);
        // Study: Run the following branch when `!project` is truthy.
        if (!project) {
            // Study: Stop this execution path by throwing `new NotFoundError("Project not found in your organization.")`.
            throw new NotFoundError("Project not found in your organization.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Validate contractor filter tenant
    // Study: Run the following branch when `filters.contractorId` is truthy.
    if (filters.contractorId) {
        // Study: Call `findContractorById` and wait for it to finish and store its result in `contractor`.
        const contractor = await findContractorById(filters.contractorId, organizationId);
        // Study: Run the following branch when `!contractor` is truthy.
        if (!contractor) {
            // Study: Stop this execution path by throwing `new NotFoundError("Contractor not found in your organization.")`.
            throw new NotFoundError("Contractor not found in your organization.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Study: Call `assignmentRepository.findMany` and wait for it to finish and store its result in `assignments`.
    const assignments = await assignmentRepository.findMany(organizationId, filters);
    
    // Study: Return `assignments` to the caller.
    return assignments;
// Study: Close the code block.
};

// Study: Export `getPlatformAssignments` as an async function that returns a promise.
export const getPlatformAssignments = async (filters: {
    // Study: Define `projectId` as optional with type `string`.
    projectId?: string;
    // Study: Define `contractorId` as optional with type `string`.
    contractorId?: string;
    // Study: Define `status` as optional with type `ContractorAssignmentStatus`.
    status?: ContractorAssignmentStatus;
// Study: Call `assignmentRepository.findAllPlatform`.
}) => assignmentRepository.findAllPlatform(filters);

// Study: Export `updateAssignment` as an async function that returns a promise.
export const updateAssignment = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `assignmentId` with type `string`.
    assignmentId: string,
    // Study: Accept `data` with type `UpdateContractorProjectAssignmentBody`.
    data: UpdateContractorProjectAssignmentBody
// Study: Close this group and continue the enclosing expression.
) => {
    // 1. Fetch assignment and verify tenant
    // Study: Call `assignmentRepository.findById` and wait for it to finish and store its result in `assignment`.
    const assignment = await assignmentRepository.findById(assignmentId);
    // Study: Run the following branch when `!assignment` is truthy.
    if (!assignment) {
        // Study: Stop this execution path by throwing `new NotFoundError("Assignment not found.")`.
        throw new NotFoundError("Assignment not found.");
    // Study: Close the code block.
    }
    
    // Study: Run the following branch when `assignment.project.organizationId !== organizationId` is truthy.
    if (assignment.project.organizationId !== organizationId) {
        // Study: Stop this execution path by throwing `new NotFoundError("Assignment not found.")`.
        throw new NotFoundError("Assignment not found.");
    // Study: Close the code block.
    }

    // 2. Responsibility validation
    // Study: Run the following branch when `data.responsibilityIds && data.responsibilityIds.length > 0` is truthy.
    if (data.responsibilityIds && data.responsibilityIds.length > 0) {
        // Study: Fetch records matching the query through `prisma.responsibility` and wait for it to finish and store its result in `responsibilities`.
        const responsibilities = await prisma.responsibility.findMany({
            // Study: Set the conditions that database records must match using id.
            where: { id: { in: data.responsibilityIds } },
        // Study: Close the object literal.
        });

        // Study: Run the following branch when `responsibilities.length !== data.responsibilityIds.length` is truthy.
        if (responsibilities.length !== data.responsibilityIds.length) {
            // Study: Stop this execution path by throwing `new BadRequestError("One or more responsibilities do not exist.")`.
            throw new BadRequestError("One or more responsibilities do not exist.");
        // Study: Close the code block.
        }

        // Study: Keep the items in `responsibilities` that satisfy the predicate and store the result as `inactiveResponsibilities`.
        const inactiveResponsibilities = responsibilities.filter(r => !r.isActive);
        // Study: Run the following branch when `inactiveResponsibilities.length > 0` is truthy.
        if (inactiveResponsibilities.length > 0) {
            // Study: Stop this execution path by throwing `new BadRequestError("One or more responsibilities are inactive.")`.
            throw new BadRequestError("One or more responsibilities are inactive.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // 3. Date validation
    // Study: Set `resultingStartDate` to `data.startDate !== undefined ? data.startDate : assignment.startDate`.
    const resultingStartDate = data.startDate !== undefined ? data.startDate : assignment.startDate;
    // Study: Set `resultingEndDate` to `data.endDate !== undefined ? data.endDate : assignment.endDate`.
    const resultingEndDate = data.endDate !== undefined ? data.endDate : assignment.endDate;

    // Study: Run the following branch when `resultingStartDate !== null && resultingEndDate !== null` is truthy.
    if (resultingStartDate !== null && resultingEndDate !== null) {
        // Study: Run the following branch when `resultingEndDate < resultingStartDate` is truthy.
        if (resultingEndDate < resultingStartDate) {
            // Study: Stop this execution path by throwing `new BadRequestError("Resulting end date cannot be before start date.")`.
            throw new BadRequestError("Resulting end date cannot be before start date.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Study: Run the following branch when `data.startDate !== undefined || data.endDate !== undefined` is truthy.
    if (data.startDate !== undefined || data.endDate !== undefined) {
        // Study: Call `labourAssignmentRepository.findMany` and wait for it to finish and store its result in `childLabourAssignments`.
        const childLabourAssignments = await labourAssignmentRepository.findMany(organizationId, {
            // Study: Set `contractorProjectAssignmentId` to `assignmentId`.
            contractorProjectAssignmentId: assignmentId,
        // Study: Close the object literal.
        });

        // Study: Iterate over each item from `childLabourAssignments` using `const la`.
        for (const la of childLabourAssignments) {
            // Study: Run the following branch when `resultingStartDate !== null && la.startDate < resultingStartDate` is truthy.
            if (resultingStartDate !== null && la.startDate < resultingStartDate) {
                // Study: Stop this execution path by throwing `new ConflictError("Contractor project assignment dates cannot be changed because th…`.
                throw new ConflictError("Contractor project assignment dates cannot be changed because they would invalidate existing labour assignments.");
            // Study: Close the code block.
            }
            // Study: Run the following branch when `resultingEndDate !== null && la.endDate > resultingEndDate` is truthy.
            if (resultingEndDate !== null && la.endDate > resultingEndDate) {
                // Study: Stop this execution path by throwing `new ConflictError("Contractor project assignment dates cannot be changed because th…`.
                throw new ConflictError("Contractor project assignment dates cannot be changed because they would invalidate existing labour assignments.");
            // Study: Close the code block.
            }
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }


    // Study: Run the following branch when `data.status !== undefined && data.status !== assignment.status` is truthy.
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
        // Study: Close the object literal.
        };

        // Study: Run the following branch when `!allowedTransitions[currentStatus].includes(requestedStatus)` is truthy.
        if (!allowedTransitions[currentStatus].includes(requestedStatus)) {
            // Study: Stop this execution path by throwing `new BadRequestError('Cannot change assignment status from ${currentStatus} to ${req…`.
            throw new BadRequestError(`Cannot change assignment status from ${currentStatus} to ${requestedStatus}.`);
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Study: Set `cancelActiveLabourAssignments` to `false`.
    let cancelActiveLabourAssignments = false;
    // Study: Run the following branch when `data.status !== undefined && data.status !== assignment.status` is truthy.
    if (data.status !== undefined && data.status !== assignment.status) {
        // Study: Run the following branch when `data.status === ContractorAssignmentStatus.COMPLETED || data.status === ContractorA…` is truthy.
        if (
            // Study: Evaluate `data.status === ContractorAssignmentStatus.COMPLETED || data.status === ContractorA…`.
            data.status === ContractorAssignmentStatus.COMPLETED ||
            // Study: Evaluate `data.status === ContractorAssignmentStatus.TERMINATED`.
            data.status === ContractorAssignmentStatus.TERMINATED ||
            // Study: Evaluate `data.status === ContractorAssignmentStatus.CANCELLED`.
            data.status === ContractorAssignmentStatus.CANCELLED
        // Study: Close this group and continue the enclosing expression.
        ) {
            // Study: Assign `true` to `cancelActiveLabourAssignments`.
            cancelActiveLabourAssignments = true;
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // 4. Execute Update
    // Study: Return `await assignmentRepository.update(assignmentId, { scopeDescription: data.scopeDescr…` to the caller.
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
        // Study: Pass the current `cancelActiveLabourAssignments` value under the same property name.
        cancelActiveLabourAssignments,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};
