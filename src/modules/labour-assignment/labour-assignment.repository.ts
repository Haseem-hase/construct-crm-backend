// Study: This file is about which workers are assigned to each job. Finds or saves information in the database, where the CRM keeps its records.
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";
// Study: Bring in `{ Prisma }` from `"@prisma/client"` so this file can use it.
import { Prisma } from "@prisma/client";

// Study: Build the object `defaultIncludes` with the entries below.
const defaultIncludes = {
    // Study: Start the nested value for `labour`.
    labour: { include: { organization: { select: { id: true, name: true } } } },
    // Study: Start the nested value for `assignment`.
    assignment: {
        // Study: Ask for linked information along with the main record.
        include: {
            // Study: Start the nested value for `project`.
            project: { include: { organization: { select: { id: true, name: true } } } },
            // Study: Start the nested value for `contractor`.
            contractor: { include: { organization: { select: { id: true, name: true } } } },
        // Study: End this group of values.
        },
    // Study: End this group of values.
    },
// Study: End this group of values.
};

// Study: Make `findById` available to other files. Its result arrives after its work finishes.
export const findById = async (id: string, organizationId: string) => {
    // Study: Give `await prisma.labourAssignment.findFirst({ where: { id, assignment: { project: { org…` back to the code that asked for it.
    return await prisma.labourAssignment.findFirst({
        // Study: Set the conditions that records must meet using id, assignment.
        where: {
            // Study: Carry the value of `id` into the new group under the same name.
            id,
            // Study: Start the nested value for `assignment`.
            assignment: {
                // Study: Start the nested value for `project`.
                project: {
                    // Study: Carry the value of `organizationId` into the new group under the same name.
                    organizationId,
                // Study: End this group of values.
                },
            // Study: End this group of values.
            },
        // Study: End this group of values.
        },
        // Study: Ask for linked information along with the main record using `defaultIncludes`.
        include: defaultIncludes,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findMany` available to other files. Its result arrives after its work finishes.
export const findMany = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `filters`. `{ labourId?: string; contractorProjectAssignmentId?: string; status?: Prisma.EnumLa…` with initial value `{}` describes what that information should look like.
    filters: {
        // Study: Define `labourId` as optional with type `string`.
        labourId?: string;
        // Study: Define `contractorProjectAssignmentId` as optional with type `string`.
        contractorProjectAssignmentId?: string;
        // Study: Define `status` as optional with type `Prisma.EnumLabourAssignmentStatusFilter | "ACTIVE" | "COMPLETED" | "CANCELLED"`.
        status?: Prisma.EnumLabourAssignmentStatusFilter | "ACTIVE" | "COMPLETED" | "CANCELLED";
    // Study: Finish this group and continue the surrounding step.
    } = {}
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.labourAssignment.findMany({ where: { assignment: { project: { organiza…` back to the code that asked for it.
    return await prisma.labourAssignment.findMany({
        // Study: Set the conditions that records must meet using assignment.
        where: {
            // Study: Start the nested value for `assignment`.
            assignment: {
                // Study: Start the nested value for `project`.
                project: {
                    // Study: Carry the value of `organizationId` into the new group under the same name.
                    organizationId,
                // Study: End this group of values.
                },
            // Study: End this group of values.
            },
            // Study: Expand the values from `(filters.labourId && { labourId: filters.labourId })` into the surrounding collection.
            ...(filters.labourId && { labourId: filters.labourId }),
            // Study: Expand the values from `(filters.contractorProjectAssignmentId && { contractorProjectAssignmentId: filters.…` into the surrounding collection.
            ...(filters.contractorProjectAssignmentId && { contractorProjectAssignmentId: filters.contractorProjectAssignmentId }),
            // Study: Expand the values from `(filters.status && { status: filters.status })` into the surrounding collection.
            ...(filters.status && { status: filters.status }),
        // Study: End this group of values.
        },
        // Study: Ask for linked information along with the main record using `defaultIncludes`.
        include: defaultIncludes,
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `startDate` to `"desc"`.
            startDate: "desc",
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findAllPlatform` available to other files. Its result arrives after its work finishes.
export const findAllPlatform = async (filters: {
    // Study: Define `labourId` as optional with type `string`.
    labourId?: string;
    // Study: Define `contractorProjectAssignmentId` as optional with type `string`.
    contractorProjectAssignmentId?: string;
    // Study: Define `status` as optional with type `Prisma.EnumLabourAssignmentStatusFilter | "ACTIVE" | "COMPLETED" | "CANCELLED"`.
    status?: Prisma.EnumLabourAssignmentStatusFilter | "ACTIVE" | "COMPLETED" | "CANCELLED";
// Study: Find all matching records using `prisma.labourAssignment`.
} = {}) => prisma.labourAssignment.findMany({
    // Study: Set the conditions that records must meet.
    where: {
        // Study: Expand the values from `(filters.labourId && { labourId: filters.labourId })` into the surrounding collection.
        ...(filters.labourId && { labourId: filters.labourId }),
        // Study: Expand the values from `(filters.contractorProjectAssignmentId && { contractorProjectAssignmentId: filters.…` into the surrounding collection.
        ...(filters.contractorProjectAssignmentId && { contractorProjectAssignmentId: filters.contractorProjectAssignmentId }),
        // Study: Expand the values from `(filters.status && { status: filters.status })` into the surrounding collection.
        ...(filters.status && { status: filters.status }),
    // Study: End this group of values.
    },
    // Study: Ask for linked information along with the main record using `defaultIncludes`.
    include: defaultIncludes,
    // Study: Set the sort order for the returned records.
    orderBy: { startDate: "desc" },
// Study: End this group of values.
});

// Study: Make `findPlatformById` available to other files. Its result arrives after its work finishes.
export const findPlatformById = async (id: string) => prisma.labourAssignment.findUnique({
    // Study: Set the conditions that records must meet using id.
    where: { id },
    // Study: Ask for linked information along with the main record using `defaultIncludes`.
    include: defaultIncludes,
// Study: End this group of values.
});

// Study: Make `findByLabour` available to other files. Its result arrives after its work finishes.
export const findByLabour = async (labourId: string, organizationId: string) => {
    // Study: Give `await prisma.labourAssignment.findMany({ where: { labourId, assignment: { project: …` back to the code that asked for it.
    return await prisma.labourAssignment.findMany({
        // Study: Set the conditions that records must meet using labourId, assignment.
        where: {
            // Study: Carry the value of `labourId` into the new group under the same name.
            labourId,
            // Study: Start the nested value for `assignment`.
            assignment: {
                // Study: Start the nested value for `project`.
                project: {
                    // Study: Carry the value of `organizationId` into the new group under the same name.
                    organizationId,
                // Study: End this group of values.
                },
            // Study: End this group of values.
            },
        // Study: End this group of values.
        },
        // Study: Ask for linked information along with the main record using `defaultIncludes`.
        include: defaultIncludes,
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `startDate` to `"desc"`.
            startDate: "desc",
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findOverlappingAssignments` available to other files. Its result arrives after its work finishes.
export const findOverlappingAssignments = async (
    // Study: This step receives `labourId`. `string` describes what that information should look like.
    labourId: string,
    // Study: This step receives `startDate`. `Date` describes what that information should look like.
    startDate: Date,
    // Study: This step receives `endDate`. `Date` describes what that information should look like.
    endDate: Date,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `excludeId` as optional. `string` describes what that information should look like.
    excludeId?: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Build the object `whereClause` with the entries below.
    const whereClause: Prisma.LabourAssignmentWhereInput = {
        // Study: Carry the value of `labourId` into the new group under the same name.
        labourId,
        // Study: Start the nested value for `startDate`.
        startDate: {
            // Study: Set `lte` to `endDate`.
            lte: endDate,
        // Study: End this group of values.
        },
        // Study: Start the nested value for `endDate`.
        endDate: {
            // Study: Set `gte` to `startDate`.
            gte: startDate,
        // Study: End this group of values.
        },
        // Study: Start the nested value for `assignment`.
        assignment: {
            // Study: Start the nested value for `project`.
            project: {
                // Study: Carry the value of `organizationId` into the new group under the same name.
                organizationId,
            // Study: End this group of values.
            },
        // Study: End this group of values.
        },
    // Study: End this group of values.
    };

    // Study: Do the next step if this check passes: `excludeId`.
    if (excludeId) {
        // Study: Assign `{ not: excludeId, }` to `whereClause.id`.
        whereClause.id = {
            // Study: Set `not` to `excludeId`.
            not: excludeId,
        // Study: End this group of values.
        };
    // Study: End this group of steps.
    }

    // Study: Give `await prisma.labourAssignment.findMany({ where: whereClause, include: defaultInclud…` back to the code that asked for it.
    return await prisma.labourAssignment.findMany({
        // Study: Set `where` to `whereClause`.
        where: whereClause,
        // Study: Ask for linked information along with the main record using `defaultIncludes`.
        include: defaultIncludes,
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `startDate` to `"asc"`.
            startDate: "asc",
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `create` available to other files. Its result arrives after its work finishes.
export const create = async (data: Prisma.LabourAssignmentUncheckedCreateInput) => {
    // Study: Give `await prisma.labourAssignment.create({ data, include: defaultIncludes, })` back to the code that asked for it.
    return await prisma.labourAssignment.create({
        // Study: Carry the value of `data` into the new group under the same name.
        data,
        // Study: Ask for linked information along with the main record using `defaultIncludes`.
        include: defaultIncludes,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `update` available to other files. Its result arrives after its work finishes.
export const update = async (id: string, data: Prisma.LabourAssignmentUncheckedUpdateInput) => {
    // Study: Give `await prisma.labourAssignment.update({ where: { id }, data, include: defaultInclude…` back to the code that asked for it.
    return await prisma.labourAssignment.update({
        // Study: Set the conditions that records must meet using id.
        where: { id },
        // Study: Carry the value of `data` into the new group under the same name.
        data,
        // Study: Ask for linked information along with the main record using `defaultIncludes`.
        include: defaultIncludes,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};
