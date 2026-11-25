// Study: This file is about which workers are assigned to each job. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `* as labourAssignmentRepository` from `"./labour-assignment.repository"` so this file can use it.
import * as labourAssignmentRepository from "./labour-assignment.repository";
// Study: Bring in `{ findLabourById }` from `"../labour/labour.repository"` so this file can use it.
import { findLabourById } from "../labour/labour.repository";
// Study: Bring in `{ findById as findContractorProjectAssignmentById }` from `"../contractor-project-assignment/contractor-project-assignment.repository"` so this file can use it.
import { findById as findContractorProjectAssignmentById } from "../contractor-project-assignment/contractor-project-assignment.repository";
// Study: Bring in `{ CreateLabourAssignmentInput, UpdateLabourAssignmentInput }` from `"./labour-assignment.types"` so this file can use it.
import { CreateLabourAssignmentInput, UpdateLabourAssignmentInput } from "./labour-assignment.types";
// Study: Bring in `{ NotFoundError }` from `"../../errors/NotFoundError"` so this file can use it.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Bring in `{ BadRequestError }` from `"../../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../../errors/BadRequestError";
// Study: Bring in `{ ConflictError }` from `"../../errors/ConflictError"` so this file can use it.
import { ConflictError } from "../../errors/ConflictError";
// Study: Bring in `{ LabourAssignmentStatus, LabourStatus, ProjectStatus, ContractorStatus, Contractor…` from `"@prisma/client"` so this file can use it.
import { 
    // Study: Make `LabourAssignmentStatus` from the other file available here.
    LabourAssignmentStatus, 
    // Study: Make `LabourStatus` from the other file available here.
    LabourStatus, 
    // Study: Make `ProjectStatus` from the other file available here.
    ProjectStatus, 
    // Study: Make `ContractorStatus` from the other file available here.
    ContractorStatus, 
    // Study: Make `ContractorAssignmentStatus` from the other file available here.
    ContractorAssignmentStatus 
// Study: Finish this group and continue the surrounding step.
} from "@prisma/client";

// Study: Make `createAssignment` available to other files. Its result arrives after its work finishes.
export const createAssignment = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `data`. `CreateLabourAssignmentInput` describes what that information should look like.
    data: CreateLabourAssignmentInput
// Study: Finish this group and continue the surrounding step.
) => {
    // 2 & 3. Find Labour and verify organization ownership
    // Study: Call `findLabourById` and wait for it to finish and store its result in `labour`.
    const labour = await findLabourById(data.labourId, organizationId);
    // Study: Do the next step if there is no value for `labour`.
    if (!labour) {
        // Study: Stop here and report this problem: "Labour not found in your organization."
        throw new NotFoundError("Labour not found in your organization.");
    // Study: End this group of steps.
    }
    
    // 4. Verify Labour is ACTIVE
    // Study: Do the next step if this check passes: `labour.status !== LabourStatus.ACTIVE`.
    if (labour.status !== LabourStatus.ACTIVE) {
        // Study: Stop here and pass the problem onward: `new BadRequestError('Labour is not active. Current status: ${labour.status}')`.
        throw new BadRequestError(`Labour is not active. Current status: ${labour.status}`);
    // Study: End this group of steps.
    }

    // 5. Find ContractorProjectAssignment
    // Study: Call `findContractorProjectAssignmentById` and wait for it to finish and store its result in `contractorAssignment`.
    const contractorAssignment = await findContractorProjectAssignmentById(data.contractorProjectAssignmentId);
    // Study: Do the next step if there is no value for `contractorAssignment`.
    if (!contractorAssignment) {
        // Study: Stop here and report this problem: "Contractor project assignment not found."
        throw new NotFoundError("Contractor project assignment not found.");
    // Study: End this group of steps.
    }

    // 6. Verify its Project belongs to organization (tenant isolation)
    // Study: Do the next step if this check passes: `contractorAssignment.project.organizationId !== organizationId`.
    if (contractorAssignment.project.organizationId !== organizationId) {
        // Study: Stop here and report this problem: "Contractor project assignment not found."
        throw new NotFoundError("Contractor project assignment not found.");
    // Study: End this group of steps.
    }

    // 7. Verify Project is ACTIVE
    // Study: Do the next step if this check passes: `contractorAssignment.project.status !== ProjectStatus.ACTIVE`.
    if (contractorAssignment.project.status !== ProjectStatus.ACTIVE) {
        // Study: Stop here and pass the problem onward: `new BadRequestError('Project must be active to assign labour. Current status: ${con…`.
        throw new BadRequestError(`Project must be active to assign labour. Current status: ${contractorAssignment.project.status}`);
    // Study: End this group of steps.
    }

    // 8 & 9. Verify Contractor is from the same organization and is ACTIVE
    // Study: Do the next step if this check passes: `contractorAssignment.contractor.organizationId !== organizationId`.
    if (contractorAssignment.contractor.organizationId !== organizationId) {
        // Study: Stop here and report this problem: "Contractor must belong to the same organization."
        throw new BadRequestError("Contractor must belong to the same organization.");
    // Study: End this group of steps.
    }
    // Study: Do the next step if this check passes: `contractorAssignment.contractor.status !== ContractorStatus.ACTIVE`.
    if (contractorAssignment.contractor.status !== ContractorStatus.ACTIVE) {
        // Study: Stop here and pass the problem onward: `new BadRequestError('Contractor must be active. Current status: ${contractorAssignm…`.
        throw new BadRequestError(`Contractor must be active. Current status: ${contractorAssignment.contractor.status}`);
    // Study: End this group of steps.
    }

    // 10. Verify ContractorProjectAssignment is operational
    // Study: Do the next step if this check passes: `contractorAssignment.status !== ContractorAssignmentStatus.ACTIVE`.
    if (contractorAssignment.status !== ContractorAssignmentStatus.ACTIVE) {
        // Study: Stop here and pass the problem onward: `new BadRequestError('Cannot assign labour under a contractor assignment with status…`.
        throw new BadRequestError(`Cannot assign labour under a contractor assignment with status: ${contractorAssignment.status}`);
    // Study: End this group of steps.
    }

    // 12. Verify dates fit inside ContractorProjectAssignment dates where applicable
    // Study: Do the next step if this check passes: `contractorAssignment.startDate && data.startDate < contractorAssignment.startDate`.
    if (contractorAssignment.startDate && data.startDate < contractorAssignment.startDate) {
        // Study: Stop here and pass the problem onward: `new BadRequestError("Labour assignment dates must fall within the contractor projec…`.
        throw new BadRequestError("Labour assignment dates must fall within the contractor project assignment period.");
    // Study: End this group of steps.
    }
    // Study: Do the next step if this check passes: `contractorAssignment.endDate && data.endDate > contractorAssignment.endDate`.
    if (contractorAssignment.endDate && data.endDate > contractorAssignment.endDate) {
        // Study: Stop here and pass the problem onward: `new BadRequestError("Labour assignment dates must fall within the contractor projec…`.
        throw new BadRequestError("Labour assignment dates must fall within the contractor project assignment period.");
    // Study: End this group of steps.
    }

    // 13. Check Labour availability using findOverlappingAssignments()
    // NOTE: This performs a read-then-write check. True database-level concurrency protection
    // may require a transaction/locking strategy later if high concurrency is expected.
    // Study: Call `labourAssignmentRepository.findOverlappingAssignments` and wait for it to finish and store its result in `overlapping`.
    const overlapping = await labourAssignmentRepository.findOverlappingAssignments(
        // Study: Use the labour id that was submitted for this step.
        data.labourId,
        // Study: Use the start date that was submitted for this step.
        data.startDate,
        // Study: Use the end date that was submitted for this step.
        data.endDate,
        // Study: Supply `organizationId` to the surrounding statement.
        organizationId
    // Study: End the list of information being sent to this step.
    );

    // Study: Do the next step if this check passes: `overlapping.length > 0`.
    if (overlapping.length > 0) {
        // Study: Stop here and pass the problem onward: `new ConflictError("Labour is already assigned to another project during the request…`.
        throw new ConflictError("Labour is already assigned to another project during the requested dates.");
    // Study: End this group of steps.
    }

    // 14. Create LabourAssignment with status ACTIVE
    // Study: Give `await labourAssignmentRepository.create({ labourId: data.labourId, contractorProjec…` back to the code that asked for it.
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
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `getAssignmentById` available to other files. Its result arrives after its work finishes.
export const getAssignmentById = async (organizationId: string, assignmentId: string) => {
    // 15. Retrieve assignment by ID, safely scoped to organization
    // Study: Call `labourAssignmentRepository.findById` and wait for it to finish and store its result in `assignment`.
    const assignment = await labourAssignmentRepository.findById(assignmentId, organizationId);
    // Study: Do the next step if there is no value for `assignment`.
    if (!assignment) {
        // Study: Stop here and report this problem: "Labour assignment not found."
        throw new NotFoundError("Labour assignment not found.");
    // Study: End this group of steps.
    }
    // Study: Give `assignment` back to the code that asked for it.
    return assignment;
// Study: End this group of steps.
};

// Study: Make `getPlatformAssignmentById` available to other files. Its result arrives after its work finishes.
export const getPlatformAssignmentById = async (assignmentId: string) => {
    // Study: Call `labourAssignmentRepository.findPlatformById` and wait for it to finish and store its result in `assignment`.
    const assignment = await labourAssignmentRepository.findPlatformById(assignmentId);
    // Study: Do the next step if there is no value for `assignment` . If so, stop and report "Labour assignment not found."
    if (!assignment) throw new NotFoundError("Labour assignment not found.");
    // Study: Give `assignment` back to the code that asked for it.
    return assignment;
// Study: End this group of steps.
};

// Study: Make `getAssignments` available to other files. Its result arrives after its work finishes.
export const getAssignments = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `filters`. `{ labourId?: string; contractorProjectAssignmentId?: string; status?: LabourAssignm…` describes what that information should look like.
    filters: {
        // Study: Define `labourId` as optional with type `string`.
        labourId?: string;
        // Study: Define `contractorProjectAssignmentId` as optional with type `string`.
        contractorProjectAssignmentId?: string;
        // Study: Define `status` as optional with type `LabourAssignmentStatus`.
        status?: LabourAssignmentStatus;
    // Study: Close the object type.
    }
// Study: Finish this group and continue the surrounding step.
) => {
    // 16. Pass organizationId directly to the repository for tenant filtering
    // Study: Give `await labourAssignmentRepository.findMany(organizationId, filters)` back to the code that asked for it.
    return await labourAssignmentRepository.findMany(organizationId, filters);
// Study: End this group of steps.
};

// Study: Make `getPlatformAssignments` available to other files. Its result arrives after its work finishes.
export const getPlatformAssignments = async (filters: {
    // Study: Define `labourId` as optional with type `string`.
    labourId?: string;
    // Study: Define `contractorProjectAssignmentId` as optional with type `string`.
    contractorProjectAssignmentId?: string;
    // Study: Define `status` as optional with type `LabourAssignmentStatus`.
    status?: LabourAssignmentStatus;
// Study: Call `labourAssignmentRepository.findAllPlatform`.
}) => labourAssignmentRepository.findAllPlatform(filters);

// Study: Make `updateAssignment` available to other files. Its result arrives after its work finishes.
export const updateAssignment = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `assignmentId`. `string` describes what that information should look like.
    assignmentId: string,
    // Study: This step receives `data`. `UpdateLabourAssignmentInput` describes what that information should look like.
    data: UpdateLabourAssignmentInput
// Study: Finish this group and continue the surrounding step.
) => {
    // 1 & 2. Find assignment within organization and reject if not found
    // Study: Call `labourAssignmentRepository.findById` and wait for it to finish and store its result in `assignment`.
    const assignment = await labourAssignmentRepository.findById(assignmentId, organizationId);
    // Study: Do the next step if there is no value for `assignment`.
    if (!assignment) {
        // Study: Stop here and report this problem: "Labour assignment not found."
        throw new NotFoundError("Labour assignment not found.");
    // Study: End this group of steps.
    }

    // 3. Determine resulting values using existing + incoming data
    // Study: Set `resultingStartDate` to `data.startDate !== undefined ? data.startDate : assignment.startDate`.
    const resultingStartDate = data.startDate !== undefined ? data.startDate : assignment.startDate;
    // Study: Set `resultingEndDate` to `data.endDate !== undefined ? data.endDate : assignment.endDate`.
    const resultingEndDate = data.endDate !== undefined ? data.endDate : assignment.endDate;

    // 4. Validate resulting date range
    // Study: Do the next step if this check passes: `resultingEndDate < resultingStartDate`.
    if (resultingEndDate < resultingStartDate) {
        // Study: Stop here and report this problem: "Resulting end date cannot be before start date."
        throw new BadRequestError("Resulting end date cannot be before start date.");
    // Study: End this group of steps.
    }

    // Re-verify dates fit inside parent ContractorProjectAssignment dates where applicable
    // Study: Do the next step if this check passes: `data.startDate !== undefined || data.endDate !== undefined`.
    if (data.startDate !== undefined || data.endDate !== undefined) {
        // Study: Set `contractorAssignment` to `assignment.assignment`.
        const contractorAssignment = assignment.assignment;
        // Study: Do the next step if this check passes: `contractorAssignment.startDate && resultingStartDate < contractorAssignment.startDate`.
        if (contractorAssignment.startDate && resultingStartDate < contractorAssignment.startDate) {
            // Study: Stop here and pass the problem onward: `new BadRequestError("Labour assignment dates must fall within the contractor projec…`.
            throw new BadRequestError("Labour assignment dates must fall within the contractor project assignment period.");
        // Study: End this group of steps.
        }
        // Study: Do the next step if this check passes: `contractorAssignment.endDate && resultingEndDate > contractorAssignment.endDate`.
        if (contractorAssignment.endDate && resultingEndDate > contractorAssignment.endDate) {
            // Study: Stop here and pass the problem onward: `new BadRequestError("Labour assignment dates must fall within the contractor projec…`.
            throw new BadRequestError("Labour assignment dates must fall within the contractor project assignment period.");
        // Study: End this group of steps.
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
        // Study: End the list of information being sent to this step.
        );

        // Study: Do the next step if this check passes: `overlapping.length > 0`.
        if (overlapping.length > 0) {
            // Study: Stop here and pass the problem onward: `new ConflictError("Labour is already assigned to another project during the request…`.
            throw new ConflictError("Labour is already assigned to another project during the requested dates.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // 6. Validate status transition if status changes
    // Study: Do the next step if this check passes: `data.status !== undefined && data.status !== assignment.status`.
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

    // 7-10. Update only allowed mutable fields (relationships are strictly omitted)
    // Study: Give `await labourAssignmentRepository.update(assignmentId, { startDate: data.startDate, …` back to the code that asked for it.
    return await labourAssignmentRepository.update(assignmentId, {
        // Study: Set `startDate` to `data.startDate`.
        startDate: data.startDate,
        // Study: Set `endDate` to `data.endDate`.
        endDate: data.endDate,
        // Study: Set `notes` to `data.notes`.
        notes: data.notes,
        // Study: Set `status` to `data.status`.
        status: data.status,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};
