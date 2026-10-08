import * as labourAssignmentRepository from "./labour-assignment.repository";
import { findLabourById } from "../labour/labour.repository";
import { findById as findContractorProjectAssignmentById } from "../contractor-project-assignment/contractor-project-assignment.repository";
import { CreateLabourAssignmentInput, UpdateLabourAssignmentInput } from "./labour-assignment.types";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";
import { ConflictError } from "../../errors/ConflictError";
import { 
    LabourAssignmentStatus, 
    LabourStatus, 
    ProjectStatus, 
    ContractorStatus, 
    ContractorAssignmentStatus 
} from "@prisma/client";

export const createAssignment = async (
    organizationId: string,
    data: CreateLabourAssignmentInput
) => {
    // 2 & 3. Find Labour and verify organization ownership
    const labour = await findLabourById(data.labourId, organizationId);
    if (!labour) {
        throw new NotFoundError("Labour not found in your organization.");
    }
    
    // 4. Verify Labour is ACTIVE
    if (labour.status !== LabourStatus.ACTIVE) {
        throw new BadRequestError(`Labour is not active. Current status: ${labour.status}`);
    }

    // 5. Find ContractorProjectAssignment
    const contractorAssignment = await findContractorProjectAssignmentById(data.contractorProjectAssignmentId);
    if (!contractorAssignment) {
        throw new NotFoundError("Contractor project assignment not found.");
    }

    // 6. Verify its Project belongs to organization (tenant isolation)
    if (contractorAssignment.project.organizationId !== organizationId) {
        throw new NotFoundError("Contractor project assignment not found.");
    }

    // 7. Verify Project is ACTIVE
    if (contractorAssignment.project.status !== ProjectStatus.ACTIVE) {
        throw new BadRequestError(`Project must be active to assign labour. Current status: ${contractorAssignment.project.status}`);
    }

    // 8 & 9. Verify Contractor is from the same organization and is ACTIVE
    if (contractorAssignment.contractor.organizationId !== organizationId) {
        throw new BadRequestError("Contractor must belong to the same organization.");
    }
    if (contractorAssignment.contractor.status !== ContractorStatus.ACTIVE) {
        throw new BadRequestError(`Contractor must be active. Current status: ${contractorAssignment.contractor.status}`);
    }

    // 10. Verify ContractorProjectAssignment is operational
    if (contractorAssignment.status !== ContractorAssignmentStatus.ACTIVE) {
        throw new BadRequestError(`Cannot assign labour under a contractor assignment with status: ${contractorAssignment.status}`);
    }

    // 12. Verify dates fit inside ContractorProjectAssignment dates where applicable
    if (contractorAssignment.startDate && data.startDate < contractorAssignment.startDate) {
        throw new BadRequestError("Labour assignment dates must fall within the contractor project assignment period.");
    }
    if (contractorAssignment.endDate && data.endDate > contractorAssignment.endDate) {
        throw new BadRequestError("Labour assignment dates must fall within the contractor project assignment period.");
    }

    // 13. Check Labour availability using findOverlappingAssignments()
    // NOTE: This performs a read-then-write check. True database-level concurrency protection
    // may require a transaction/locking strategy later if high concurrency is expected.
    const overlapping = await labourAssignmentRepository.findOverlappingAssignments(
        data.labourId,
        data.startDate,
        data.endDate,
        organizationId
    );

    if (overlapping.length > 0) {
        throw new ConflictError("Labour is already assigned to another project during the requested dates.");
    }

    // 14. Create LabourAssignment with status ACTIVE
    return await labourAssignmentRepository.create({
        labourId: data.labourId,
        contractorProjectAssignmentId: data.contractorProjectAssignmentId,
        startDate: data.startDate,
        endDate: data.endDate,
        notes: data.notes,
        status: LabourAssignmentStatus.ACTIVE,
    });
};

export const getAssignmentById = async (organizationId: string, assignmentId: string) => {
    // 15. Retrieve assignment by ID, safely scoped to organization
    const assignment = await labourAssignmentRepository.findById(assignmentId, organizationId);
    if (!assignment) {
        throw new NotFoundError("Labour assignment not found.");
    }
    return assignment;
};

export const getAssignments = async (
    organizationId: string,
    filters: {
        labourId?: string;
        contractorProjectAssignmentId?: string;
        status?: LabourAssignmentStatus;
    }
) => {
    // 16. Pass organizationId directly to the repository for tenant filtering
    return await labourAssignmentRepository.findMany(organizationId, filters);
};

export const updateAssignment = async (
    organizationId: string,
    assignmentId: string,
    data: UpdateLabourAssignmentInput
) => {
    // 1 & 2. Find assignment within organization and reject if not found
    const assignment = await labourAssignmentRepository.findById(assignmentId, organizationId);
    if (!assignment) {
        throw new NotFoundError("Labour assignment not found.");
    }

    // 3. Determine resulting values using existing + incoming data
    const resultingStartDate = data.startDate !== undefined ? data.startDate : assignment.startDate;
    const resultingEndDate = data.endDate !== undefined ? data.endDate : assignment.endDate;

    // 4. Validate resulting date range
    if (resultingEndDate < resultingStartDate) {
        throw new BadRequestError("Resulting end date cannot be before start date.");
    }

    // Re-verify dates fit inside parent ContractorProjectAssignment dates where applicable
    if (data.startDate !== undefined || data.endDate !== undefined) {
        const contractorAssignment = assignment.assignment;
        if (contractorAssignment.startDate && resultingStartDate < contractorAssignment.startDate) {
            throw new BadRequestError("Labour assignment dates must fall within the contractor project assignment period.");
        }
        if (contractorAssignment.endDate && resultingEndDate > contractorAssignment.endDate) {
            throw new BadRequestError("Labour assignment dates must fall within the contractor project assignment period.");
        }

        // 5. If dates change, perform overlap checking, excluding current assignment
        const overlapping = await labourAssignmentRepository.findOverlappingAssignments(
            assignment.labourId,
            resultingStartDate,
            resultingEndDate,
            organizationId,
            assignmentId
        );

        if (overlapping.length > 0) {
            throw new ConflictError("Labour is already assigned to another project during the requested dates.");
        }
    }

    // 6. Validate status transition if status changes
    if (data.status !== undefined && data.status !== assignment.status) {
        const currentStatus = assignment.status;
        const requestedStatus = data.status;

        const allowedTransitions: Record<LabourAssignmentStatus, LabourAssignmentStatus[]> = {
            [LabourAssignmentStatus.ACTIVE]: [LabourAssignmentStatus.COMPLETED, LabourAssignmentStatus.CANCELLED],
            [LabourAssignmentStatus.COMPLETED]: [],
            [LabourAssignmentStatus.CANCELLED]: [],
        };

        if (!allowedTransitions[currentStatus].includes(requestedStatus)) {
            throw new BadRequestError(`Cannot change assignment status from ${currentStatus} to ${requestedStatus}.`);
        }
    }

    // 7-10. Update only allowed mutable fields (relationships are strictly omitted)
    return await labourAssignmentRepository.update(assignmentId, {
        startDate: data.startDate,
        endDate: data.endDate,
        notes: data.notes,
        status: data.status,
    });
};
