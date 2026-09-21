import * as assignmentRepository from "./contractor-project-assignment.repository";
import { findContractorById } from "../contractor/contractor.repository";
import { findProjectByIdAndOrganization } from "../projects/project.repository";
import * as labourAssignmentRepository from "../labour-assignment/labour-assignment.repository";
import prisma from "../../lib/prisma";
import { 
    CreateContractorProjectAssignmentBody, 
    UpdateContractorProjectAssignmentBody 
} from "./contractor-project-assignment.types";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";
import { ConflictError } from "../../errors/ConflictError";
import { ContractorStatus, ProjectStatus, ContractorAssignmentStatus } from "@prisma/client";

export const createAssignment = async (
    organizationId: string,
    data: CreateContractorProjectAssignmentBody
) => {
    // 1. Verify project ownership and status
    const project = await findProjectByIdAndOrganization(data.projectId, organizationId);
    if (!project) {
        throw new NotFoundError("Project not found in your organization.");
    }
    if (project.status !== ProjectStatus.PLANNING && project.status !== ProjectStatus.ACTIVE) {
        throw new BadRequestError(`Cannot assign contractor to a project with status: ${project.status}`);
    }

    // 2. Verify contractor ownership and status
    const contractor = await findContractorById(data.contractorId, organizationId);
    if (!contractor) {
        throw new NotFoundError("Contractor not found in your organization.");
    }
    if (contractor.status !== ContractorStatus.ACTIVE) {
        throw new BadRequestError(`Cannot assign an inactive contractor. Current status: ${contractor.status}`);
    }

    // 3. Duplicate assignment check
    const existingAssignment = await assignmentRepository.findByProjectAndContractor(data.projectId, data.contractorId);
    if (existingAssignment) {
        throw new ConflictError("This contractor is already assigned to this project.");
    }

    // 4. Responsibility validation
    if (data.responsibilityIds && data.responsibilityIds.length > 0) {
        const responsibilities = await prisma.responsibility.findMany({
            where: { id: { in: data.responsibilityIds } },
        });

        if (responsibilities.length !== data.responsibilityIds.length) {
            throw new BadRequestError("One or more responsibilities do not exist.");
        }

        const inactiveResponsibilities = responsibilities.filter(r => !r.isActive);
        if (inactiveResponsibilities.length > 0) {
            throw new BadRequestError("One or more responsibilities are inactive.");
        }
    }

    // 5. Date validation
    if (data.startDate && data.endDate) {
        if (data.endDate < data.startDate) {
            throw new BadRequestError("End date cannot be before start date.");
        }
    }

    // 6. Create Assignment
    return await assignmentRepository.create({
        projectId: data.projectId,
        contractorId: data.contractorId,
        scopeDescription: data.scopeDescription,
        startDate: data.startDate,
        endDate: data.endDate,
        notes: data.notes,
        responsibilityIds: data.responsibilityIds,
    });
};

export const getAssignmentById = async (organizationId: string, assignmentId: string) => {
    const assignment = await assignmentRepository.findById(assignmentId);
    if (!assignment) {
        throw new NotFoundError("Assignment not found.");
    }
    
    if (assignment.project.organizationId !== organizationId) {
        throw new NotFoundError("Assignment not found.");
    }

    return assignment;
};

export const getAssignments = async (
    organizationId: string,
    filters: {
        projectId?: string;
        contractorId?: string;
        status?: ContractorAssignmentStatus;
    }
) => {
    // Validate project filter tenant
    if (filters.projectId) {
        const project = await findProjectByIdAndOrganization(filters.projectId, organizationId);
        if (!project) {
            throw new NotFoundError("Project not found in your organization.");
        }
    }

    // Validate contractor filter tenant
    if (filters.contractorId) {
        const contractor = await findContractorById(filters.contractorId, organizationId);
        if (!contractor) {
            throw new NotFoundError("Contractor not found in your organization.");
        }
    }

    const assignments = await assignmentRepository.findMany(organizationId, filters);
    
    return assignments;
};

export const updateAssignment = async (
    organizationId: string,
    assignmentId: string,
    data: UpdateContractorProjectAssignmentBody
) => {
    // 1. Fetch assignment and verify tenant
    const assignment = await assignmentRepository.findById(assignmentId);
    if (!assignment) {
        throw new NotFoundError("Assignment not found.");
    }
    
    if (assignment.project.organizationId !== organizationId) {
        throw new NotFoundError("Assignment not found.");
    }

    // 2. Responsibility validation
    if (data.responsibilityIds && data.responsibilityIds.length > 0) {
        const responsibilities = await prisma.responsibility.findMany({
            where: { id: { in: data.responsibilityIds } },
        });

        if (responsibilities.length !== data.responsibilityIds.length) {
            throw new BadRequestError("One or more responsibilities do not exist.");
        }

        const inactiveResponsibilities = responsibilities.filter(r => !r.isActive);
        if (inactiveResponsibilities.length > 0) {
            throw new BadRequestError("One or more responsibilities are inactive.");
        }
    }

    // 3. Date validation
    const resultingStartDate = data.startDate !== undefined ? data.startDate : assignment.startDate;
    const resultingEndDate = data.endDate !== undefined ? data.endDate : assignment.endDate;

    if (resultingStartDate !== null && resultingEndDate !== null) {
        if (resultingEndDate < resultingStartDate) {
            throw new BadRequestError("Resulting end date cannot be before start date.");
        }
    }

    if (data.startDate !== undefined || data.endDate !== undefined) {
        const childLabourAssignments = await labourAssignmentRepository.findMany(organizationId, {
            contractorProjectAssignmentId: assignmentId,
        });

        for (const la of childLabourAssignments) {
            if (resultingStartDate !== null && la.startDate < resultingStartDate) {
                throw new ConflictError("Contractor project assignment dates cannot be changed because they would invalidate existing labour assignments.");
            }
            if (resultingEndDate !== null && la.endDate > resultingEndDate) {
                throw new ConflictError("Contractor project assignment dates cannot be changed because they would invalidate existing labour assignments.");
            }
        }
    }


    if (data.status !== undefined && data.status !== assignment.status) {
        const currentStatus = assignment.status;
        const requestedStatus = data.status;

        const allowedTransitions: Record<ContractorAssignmentStatus, ContractorAssignmentStatus[]> = {
            [ContractorAssignmentStatus.PENDING]: [ContractorAssignmentStatus.ACTIVE, ContractorAssignmentStatus.CANCELLED],
            [ContractorAssignmentStatus.ACTIVE]: [ContractorAssignmentStatus.ON_HOLD, ContractorAssignmentStatus.COMPLETED, ContractorAssignmentStatus.TERMINATED],
            [ContractorAssignmentStatus.ON_HOLD]: [ContractorAssignmentStatus.ACTIVE],
            [ContractorAssignmentStatus.COMPLETED]: [],
            [ContractorAssignmentStatus.CANCELLED]: [],
            [ContractorAssignmentStatus.TERMINATED]: [],
        };

        if (!allowedTransitions[currentStatus].includes(requestedStatus)) {
            throw new BadRequestError(`Cannot change assignment status from ${currentStatus} to ${requestedStatus}.`);
        }
    }

    let cancelActiveLabourAssignments = false;
    if (data.status !== undefined && data.status !== assignment.status) {
        if (
            data.status === ContractorAssignmentStatus.COMPLETED ||
            data.status === ContractorAssignmentStatus.TERMINATED ||
            data.status === ContractorAssignmentStatus.CANCELLED
        ) {
            cancelActiveLabourAssignments = true;
        }
    }

    // 4. Execute Update
    return await assignmentRepository.update(assignmentId, {
        scopeDescription: data.scopeDescription,
        startDate: data.startDate,
        endDate: data.endDate,
        notes: data.notes,
        status: data.status,
        responsibilityIds: data.responsibilityIds,
        cancelActiveLabourAssignments,
    });
};
