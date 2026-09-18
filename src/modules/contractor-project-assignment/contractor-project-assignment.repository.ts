import prisma from "../../lib/prisma";
import { ContractorAssignmentStatus } from "@prisma/client";

const defaultIncludes = {
    project: true,
    contractor: true,
    responsibilities: {
        include: {
            responsibility: true,
        },
    },
};

export const findById = async (id: string) => {
    return await prisma.contractorProjectAssignment.findUnique({
        where: { id },
        include: defaultIncludes,
    });
};

export const findMany = async (organizationId: string, filters: {
    projectId?: string;
    contractorId?: string;
    status?: ContractorAssignmentStatus;
} = {}) => {
    return await prisma.contractorProjectAssignment.findMany({
        where: {
            project: {
                organizationId,
            },
            ...(filters.projectId && { projectId: filters.projectId }),
            ...(filters.contractorId && { contractorId: filters.contractorId }),
            ...(filters.status && { status: filters.status }),
        },
        include: defaultIncludes,
        orderBy: {
            createdAt: "desc",
        },
    });
};

export const findByProjectAndContractor = async (projectId: string, contractorId: string) => {
    return await prisma.contractorProjectAssignment.findUnique({
        where: {
            projectId_contractorId: {
                projectId,
                contractorId,
            },
        },
        include: defaultIncludes,
    });
};

export const create = async (data: {
    projectId: string;
    contractorId: string;
    scopeDescription?: string;
    startDate?: Date;
    endDate?: Date;
    notes?: string;
    responsibilityIds?: string[];
}) => {
    return await prisma.$transaction(async (tx) => {
        const assignment = await tx.contractorProjectAssignment.create({
            data: {
                projectId: data.projectId,
                contractorId: data.contractorId,
                scopeDescription: data.scopeDescription,
                startDate: data.startDate,
                endDate: data.endDate,
                notes: data.notes,
                status: "PENDING",
            },
        });

        if (data.responsibilityIds && data.responsibilityIds.length > 0) {
            await tx.contractorProjectAssignmentResponsibility.createMany({
                data: data.responsibilityIds.map((respId) => ({
                    assignmentId: assignment.id,
                    responsibilityId: respId,
                })),
            });
        }

        return await tx.contractorProjectAssignment.findUniqueOrThrow({
            where: { id: assignment.id },
            include: defaultIncludes,
        });
    });
};

export const update = async (
    assignmentId: string,
    data: {
        scopeDescription?: string | null;
        startDate?: Date | null;
        endDate?: Date | null;
        notes?: string | null;
        responsibilityIds?: string[];
    }
) => {
    return await prisma.$transaction(async (tx) => {
        const updatedAssignment = await tx.contractorProjectAssignment.update({
            where: { id: assignmentId },
            data: {
                ...(data.scopeDescription !== undefined && { scopeDescription: data.scopeDescription }),
                ...(data.startDate !== undefined && { startDate: data.startDate }),
                ...(data.endDate !== undefined && { endDate: data.endDate }),
                ...(data.notes !== undefined && { notes: data.notes }),
            },
        });

        if (data.responsibilityIds !== undefined) {
            // Remove existing responsibilities
            await tx.contractorProjectAssignmentResponsibility.deleteMany({
                where: { assignmentId },
            });

            // Add new responsibilities if provided
            if (data.responsibilityIds.length > 0) {
                await tx.contractorProjectAssignmentResponsibility.createMany({
                    data: data.responsibilityIds.map((respId) => ({
                        assignmentId,
                        responsibilityId: respId,
                    })),
                });
            }
        }

        return await tx.contractorProjectAssignment.findUniqueOrThrow({
            where: { id: updatedAssignment.id },
            include: defaultIncludes,
        });
    });
};
