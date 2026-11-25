// Study: Apply business rules and coordinate database operations for worker placements on construction projects.
// Study: Import `* as labourAssignmentRepository` from `"./labour-assignment.repository"`.
import * as labourAssignmentRepository from "./labour-assignment.repository";
// Study: Import `{ findLabourById }` from `"../labour/labour.repository"`.
import { findLabourById } from "../labour/labour.repository";
// Study: Import `{ findById as findContractorProjectAssignmentById }` from `"../contractor-project-assignment/contractor-project-assignment.repository"`.
import { findById as findContractorProjectAssignmentById } from "../contractor-project-assignment/contractor-project-assignment.repository";
// Study: Import `{ CreateLabourAssignmentInput, UpdateLabourAssignmentInput }` from `"./labour-assignment.types"`.
import { CreateLabourAssignmentInput, UpdateLabourAssignmentInput } from "./labour-assignment.types";
// Study: Import `{ NotFoundError }` from `"../../errors/NotFoundError"`.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Import `{ BadRequestError }` from `"../../errors/BadRequestError"`.
import { BadRequestError } from "../../errors/BadRequestError";
// Study: Import `{ ConflictError }` from `"../../errors/ConflictError"`.
import { ConflictError } from "../../errors/ConflictError";
// Study: Import `{ LabourAssignmentStatus, LabourStatus, ProjectStatus, ContractorStatus, Contractor…` from `"@prisma/client"`.
import { 
    // Study: Bring `LabourAssignmentStatus` into scope from the imported module.
    LabourAssignmentStatus, 
    // Study: Bring `LabourStatus` into scope from the imported module.
    LabourStatus, 
    // Study: Bring `ProjectStatus` into scope from the imported module.
    ProjectStatus, 
    // Study: Bring `ContractorStatus` into scope from the imported module.
    ContractorStatus, 
    // Study: Bring `ContractorAssignmentStatus` into scope from the imported module.
    ContractorAssignmentStatus 
// Study: Close this group and continue the enclosing expression.
} from "@prisma/client";

// Study: Export `createAssignment` as an async function that returns a promise.
export const createAssignment = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `data` with type `CreateLabourAssignmentInput`.
    data: CreateLabourAssignmentInput
// Study: Close this group and continue the enclosing expression.
) => {
    // 2 & 3. Find Labour and verify organization ownership
    // Study: Call `findLabourById` and wait for it to finish and store its result in `labour`.
    const labour = await findLabourById(data.labourId, organizationId);
    // Study: Run the following branch when `!labour` is truthy.
    if (!labour) {
        // Study: Stop this execution path by throwing `new NotFoundError("Labour not found in your organization.")`.
        throw new NotFoundError("Labour not found in your organization.");
    // Study: Close the code block.
    }
    
    // 4. Verify Labour is ACTIVE
    // Study: Run the following branch when `labour.status !== LabourStatus.ACTIVE` is truthy.
    if (labour.status !== LabourStatus.ACTIVE) {
        // Study: Stop this execution path by throwing `new BadRequestError('Labour is not active. Current status: ${labour.status}')`.
        throw new BadRequestError(`Labour is not active. Current status: ${labour.status}`);
    // Study: Close the code block.
    }

    // 5. Find ContractorProjectAssignment
    // Study: Call `findContractorProjectAssignmentById` and wait for it to finish and store its result in `contractorAssignment`.
    const contractorAssignment = await findContractorProjectAssignmentById(data.contractorProjectAssignmentId);
    // Study: Run the following branch when `!contractorAssignment` is truthy.
    if (!contractorAssignment) {
        // Study: Stop this execution path by throwing `new NotFoundError("Contractor project assignment not found.")`.
        throw new NotFoundError("Contractor project assignment not found.");
    // Study: Close the code block.
    }

    // 6. Verify its Project belongs to organization (tenant isolation)
    // Study: Run the following branch when `contractorAssignment.project.organizationId !== organizationId` is truthy.
    if (contractorAssignment.project.organizationId !== organizationId) {
        // Study: Stop this execution path by throwing `new NotFoundError("Contractor project assignment not found.")`.
        throw new NotFoundError("Contractor project assignment not found.");
    // Study: Close the code block.
    }

    // 7. Verify Project is ACTIVE
    // Study: Run the following branch when `contractorAssignment.project.status !== ProjectStatus.ACTIVE` is truthy.
    if (contractorAssignment.project.status !== ProjectStatus.ACTIVE) {
        // Study: Stop this execution path by throwing `new BadRequestError('Project must be active to assign labour. Current status: ${con…`.
        throw new BadRequestError(`Project must be active to assign labour. Current status: ${contractorAssignment.project.status}`);
    // Study: Close the code block.
    }

    // 8 & 9. Verify Contractor is from the same organization and is ACTIVE
    // Study: Run the following branch when `contractorAssignment.contractor.organizationId !== organizationId` is truthy.
    if (contractorAssignment.contractor.organizationId !== organizationId) {
        // Study: Stop this execution path by throwing `new BadRequestError("Contractor must belong to the same organization.")`.
        throw new BadRequestError("Contractor must belong to the same organization.");
    // Study: Close the code block.
    }
    // Study: Run the following branch when `contractorAssignment.contractor.status !== ContractorStatus.ACTIVE` is truthy.
    if (contractorAssignment.contractor.status !== ContractorStatus.ACTIVE) {
        // Study: Stop this execution path by throwing `new BadRequestError('Contractor must be active. Current status: ${contractorAssignm…`.
        throw new BadRequestError(`Contractor must be active. Current status: ${contractorAssignment.contractor.status}`);
    // Study: Close the code block.
    }

    // 10. Verify ContractorProjectAssignment is operational
    // Study: Run the following branch when `contractorAssignment.status !== ContractorAssignmentStatus.ACTIVE` is truthy.
    if (contractorAssignment.status !== ContractorAssignmentStatus.ACTIVE) {
        // Study: Stop this execution path by throwing `new BadRequestError('Cannot assign labour under a contractor assignment with status…`.
        throw new BadRequestError(`Cannot assign labour under a contractor assignment with status: ${contractorAssignment.status}`);
    // Study: Close the code block.
    }

    // 12. Verify dates fit inside ContractorProjectAssignment dates where applicable
    // Study: Run the following branch when `contractorAssignment.startDate && data.startDate < contractorAssignment.startDate` is truthy.
    if (contractorAssignment.startDate && data.startDate < contractorAssignment.startDate) {
        // Study: Stop this execution path by throwing `new BadRequestError("Labour assignment dates must fall within the contractor projec…`.
        throw new BadRequestError("Labour assignment dates must fall within the contractor project assignment period.");
    // Study: Close the code block.
    }
    // Study: Run the following branch when `contractorAssignment.endDate && data.endDate > contractorAssignment.endDate` is truthy.
    if (contractorAssignment.endDate && data.endDate > contractorAssignment.endDate) {
        // Study: Stop this execution path by throwing `new BadRequestError("Labour assignment dates must fall within the contractor projec…`.
        throw new BadRequestError("Labour assignment dates must fall within the contractor project assignment period.");
    // Study: Close the code block.
    }

    // 13. Check Labour availability using findOverlappingAssignments()
    // NOTE: This performs a read-then-write check. True database-level concurrency protection
    // may require a transaction/locking strategy later if high concurrency is expected.
    // Study: Call `labourAssignmentRepository.findOverlappingAssignments` and wait for it to finish and store its result in `overlapping`.
    const overlapping = await labourAssignmentRepository.findOverlappingAssignments(
        // Study: Supply `data` to the surrounding statement.
        data.labourId,
        // Study: Supply `data` to the surrounding statement.
        data.startDate,
        // Study: Supply `data` to the surrounding statement.
        data.endDate,
        // Study: Supply `organizationId` to the surrounding statement.
        organizationId
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `overlapping.length > 0` is truthy.
    if (overlapping.length > 0) {
        // Study: Stop this execution path by throwing `new ConflictError("Labour is already assigned to another project during the request…`.
        throw new ConflictError("Labour is already assigned to another project during the requested dates.");
    // Study: Close the code block.
    }

    // 14. Create LabourAssignment with status ACTIVE
    // Study: Return `await labourAssignmentRepository.create({ labourId: data.labourId, contractorProjec…` to the caller.
    return await labourAssignmentRepository.create({
        // Study: Set `labourId` to `data.labourId`.
        labourId: data.labourId,
        // Study: Set `contractorProjectAssignmentId` to `data.contractorProjectAssignmentId`.
        contractorProjectAssignmentId: data.contractorProjectAssignmentId,
        // Study: Set `startDate` to `data.startDate`.
        startDate: data.startDate,
        // Study: Set `endDate` to `data.endDate`.
        endDate: data.endDate,
        // Study: Set `notes` to `data.notes`.
        notes: data.notes,
        // Study: Set `status` to `LabourAssignmentStatus.ACTIVE`.
        status: LabourAssignmentStatus.ACTIVE,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `getAssignmentById` as an async function that returns a promise.
export const getAssignmentById = async (organizationId: string, assignmentId: string) => {
    // 15. Retrieve assignment by ID, safely scoped to organization
    // Study: Call `labourAssignmentRepository.findById` and wait for it to finish and store its result in `assignment`.
    const assignment = await labourAssignmentRepository.findById(assignmentId, organizationId);
    // Study: Run the following branch when `!assignment` is truthy.
    if (!assignment) {
        // Study: Stop this execution path by throwing `new NotFoundError("Labour assignment not found.")`.
        throw new NotFoundError("Labour assignment not found.");
    // Study: Close the code block.
    }
    // Study: Return `assignment` to the caller.
    return assignment;
// Study: Close the code block.
};

// Study: Export `getPlatformAssignmentById` as an async function that returns a promise.
export const getPlatformAssignmentById = async (assignmentId: string) => {
    // Study: Call `labourAssignmentRepository.findPlatformById` and wait for it to finish and store its result in `assignment`.
    const assignment = await labourAssignmentRepository.findPlatformById(assignmentId);
    // Study: Run the following branch when `!assignment` is truthy and throw `new NotFoundError("Labour assignment not found.")`.
    if (!assignment) throw new NotFoundError("Labour assignment not found.");
    // Study: Return `assignment` to the caller.
    return assignment;
// Study: Close the code block.
};

// Study: Export `getAssignments` as an async function that returns a promise.
export const getAssignments = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `filters` with type `{ labourId?: string; contractorProjectAssignmentId?: string; status?: LabourAssignm…`.
    filters: {
        // Study: Define `labourId` as optional with type `string`.
        labourId?: string;
        // Study: Define `contractorProjectAssignmentId` as optional with type `string`.
        contractorProjectAssignmentId?: string;
        // Study: Define `status` as optional with type `LabourAssignmentStatus`.
        status?: LabourAssignmentStatus;
    // Study: Close the object type.
    }
// Study: Close this group and continue the enclosing expression.
) => {
    // 16. Pass organizationId directly to the repository for tenant filtering
    // Study: Return `await labourAssignmentRepository.findMany(organizationId, filters)` to the caller.
    return await labourAssignmentRepository.findMany(organizationId, filters);
// Study: Close the code block.
};

// Study: Export `getPlatformAssignments` as an async function that returns a promise.
export const getPlatformAssignments = async (filters: {
    // Study: Define `labourId` as optional with type `string`.
    labourId?: string;
    // Study: Define `contractorProjectAssignmentId` as optional with type `string`.
    contractorProjectAssignmentId?: string;
    // Study: Define `status` as optional with type `LabourAssignmentStatus`.
    status?: LabourAssignmentStatus;
// Study: Call `labourAssignmentRepository.findAllPlatform`.
}) => labourAssignmentRepository.findAllPlatform(filters);

// Study: Export `updateAssignment` as an async function that returns a promise.
export const updateAssignment = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `assignmentId` with type `string`.
    assignmentId: string,
    // Study: Accept `data` with type `UpdateLabourAssignmentInput`.
    data: UpdateLabourAssignmentInput
// Study: Close this group and continue the enclosing expression.
) => {
    // 1 & 2. Find assignment within organization and reject if not found
    // Study: Call `labourAssignmentRepository.findById` and wait for it to finish and store its result in `assignment`.
    const assignment = await labourAssignmentRepository.findById(assignmentId, organizationId);
    // Study: Run the following branch when `!assignment` is truthy.
    if (!assignment) {
        // Study: Stop this execution path by throwing `new NotFoundError("Labour assignment not found.")`.
        throw new NotFoundError("Labour assignment not found.");
    // Study: Close the code block.
    }

    // 3. Determine resulting values using existing + incoming data
    // Study: Set `resultingStartDate` to `data.startDate !== undefined ? data.startDate : assignment.startDate`.
    const resultingStartDate = data.startDate !== undefined ? data.startDate : assignment.startDate;
    // Study: Set `resultingEndDate` to `data.endDate !== undefined ? data.endDate : assignment.endDate`.
    const resultingEndDate = data.endDate !== undefined ? data.endDate : assignment.endDate;

    // 4. Validate resulting date range
    // Study: Run the following branch when `resultingEndDate < resultingStartDate` is truthy.
    if (resultingEndDate < resultingStartDate) {
        // Study: Stop this execution path by throwing `new BadRequestError("Resulting end date cannot be before start date.")`.
        throw new BadRequestError("Resulting end date cannot be before start date.");
    // Study: Close the code block.
    }

    // Re-verify dates fit inside parent ContractorProjectAssignment dates where applicable
    // Study: Run the following branch when `data.startDate !== undefined || data.endDate !== undefined` is truthy.
    if (data.startDate !== undefined || data.endDate !== undefined) {
        // Study: Set `contractorAssignment` to `assignment.assignment`.
        const contractorAssignment = assignment.assignment;
        // Study: Run the following branch when `contractorAssignment.startDate && resultingStartDate < contractorAssignment.startDate` is truthy.
        if (contractorAssignment.startDate && resultingStartDate < contractorAssignment.startDate) {
            // Study: Stop this execution path by throwing `new BadRequestError("Labour assignment dates must fall within the contractor projec…`.
            throw new BadRequestError("Labour assignment dates must fall within the contractor project assignment period.");
        // Study: Close the code block.
        }
        // Study: Run the following branch when `contractorAssignment.endDate && resultingEndDate > contractorAssignment.endDate` is truthy.
        if (contractorAssignment.endDate && resultingEndDate > contractorAssignment.endDate) {
            // Study: Stop this execution path by throwing `new BadRequestError("Labour assignment dates must fall within the contractor projec…`.
            throw new BadRequestError("Labour assignment dates must fall within the contractor project assignment period.");
        // Study: Close the code block.
        }

        // 5. If dates change, perform overlap checking, excluding current assignment
        // Study: Call `labourAssignmentRepository.findOverlappingAssignments` and wait for it to finish and store its result in `overlapping`.
        const overlapping = await labourAssignmentRepository.findOverlappingAssignments(
            // Study: Supply `assignment` to the surrounding statement.
            assignment.labourId,
            // Study: Supply `resultingStartDate` to the surrounding statement.
            resultingStartDate,
            // Study: Supply `resultingEndDate` to the surrounding statement.
            resultingEndDate,
            // Study: Supply `organizationId` to the surrounding statement.
            organizationId,
            // Study: Supply `assignmentId` to the surrounding statement.
            assignmentId
        // Study: Close the call arguments.
        );

        // Study: Run the following branch when `overlapping.length > 0` is truthy.
        if (overlapping.length > 0) {
            // Study: Stop this execution path by throwing `new ConflictError("Labour is already assigned to another project during the request…`.
            throw new ConflictError("Labour is already assigned to another project during the requested dates.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // 6. Validate status transition if status changes
    // Study: Run the following branch when `data.status !== undefined && data.status !== assignment.status` is truthy.
    if (data.status !== undefined && data.status !== assignment.status) {
        // Study: Set `currentStatus` to `assignment.status`.
        const currentStatus = assignment.status;
        // Study: Set `requestedStatus` to `data.status`.
        const requestedStatus = data.status;

        // Study: Build the object `allowedTransitions` with the entries below.
        const allowedTransitions: Record<LabourAssignmentStatus, LabourAssignmentStatus[]> = {
            // Study: Start the nested value for `[LabourAssignmentStatus.ACTIVE]`.
            [LabourAssignmentStatus.ACTIVE]: [LabourAssignmentStatus.COMPLETED, LabourAssignmentStatus.CANCELLED],
            // Study: Start the nested value for `[LabourAssignmentStatus.COMPLETED]`.
            [LabourAssignmentStatus.COMPLETED]: [],
            // Study: Start the nested value for `[LabourAssignmentStatus.CANCELLED]`.
            [LabourAssignmentStatus.CANCELLED]: [],
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

    // 7-10. Update only allowed mutable fields (relationships are strictly omitted)
    // Study: Return `await labourAssignmentRepository.update(assignmentId, { startDate: data.startDate, …` to the caller.
    return await labourAssignmentRepository.update(assignmentId, {
        // Study: Set `startDate` to `data.startDate`.
        startDate: data.startDate,
        // Study: Set `endDate` to `data.endDate`.
        endDate: data.endDate,
        // Study: Set `notes` to `data.notes`.
        notes: data.notes,
        // Study: Set `status` to `data.status`.
        status: data.status,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};
