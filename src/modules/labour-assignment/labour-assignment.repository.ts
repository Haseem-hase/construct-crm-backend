import prisma from "../../lib/prisma";
import { Prisma } from "@prisma/client";

const defaultIncludes = {
    labour: true,
    assignment: {
        include: {
            project: true,
            contractor: true,
        },
    },
};

export const findById = async (id: string, organizationId: string) => {
    return await prisma.labourAssignment.findFirst({
        where: {
            id,
            assignment: {
                project: {
                    organizationId,
                },
            },
        },
        include: defaultIncludes,
    });
};

export const findMany = async (
    organizationId: string,
    filters: {
        labourId?: string;
        contractorProjectAssignmentId?: string;
        status?: Prisma.EnumLabourAssignmentStatusFilter | "ACTIVE" | "COMPLETED" | "CANCELLED";
    } = {}
) => {
    return await prisma.labourAssignment.findMany({
        where: {
            assignment: {
                project: {
                    organizationId,
                },
            },
            ...(filters.labourId && { labourId: filters.labourId }),
            ...(filters.contractorProjectAssignmentId && { contractorProjectAssignmentId: filters.contractorProjectAssignmentId }),
            ...(filters.status && { status: filters.status }),
        },
        include: defaultIncludes,
        orderBy: {
            startDate: "desc",
        },
    });
};

export const findByLabour = async (labourId: string, organizationId: string) => {
    return await prisma.labourAssignment.findMany({
        where: {
            labourId,
            assignment: {
                project: {
                    organizationId,
                },
            },
        },
        include: defaultIncludes,
        orderBy: {
            startDate: "desc",
        },
    });
};

export const findOverlappingAssignments = async (
    labourId: string,
    startDate: Date,
    endDate: Date,
    organizationId: string,
    excludeId?: string
) => {
    const whereClause: Prisma.LabourAssignmentWhereInput = {
        labourId,
        startDate: {
            lte: endDate,
        },
        endDate: {
            gte: startDate,
        },
        assignment: {
            project: {
                organizationId,
            },
        },
    };

    if (excludeId) {
        whereClause.id = {
            not: excludeId,
        };
    }

    return await prisma.labourAssignment.findMany({
        where: whereClause,
        include: defaultIncludes,
        orderBy: {
            startDate: "asc",
        },
    });
};

export const create = async (data: Prisma.LabourAssignmentUncheckedCreateInput) => {
    return await prisma.labourAssignment.create({
        data,
        include: defaultIncludes,
    });
};

export const update = async (id: string, data: Prisma.LabourAssignmentUncheckedUpdateInput) => {
    return await prisma.labourAssignment.update({
        where: { id },
        data,
        include: defaultIncludes,
    });
};
