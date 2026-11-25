// Study: Read and write database records through Prisma for worker placements on construction projects.
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";
// Study: Import `{ Prisma }` from `"@prisma/client"`.
import { Prisma } from "@prisma/client";

// Study: Build the object `defaultIncludes` with the entries below.
const defaultIncludes = {
    // Study: Start the nested value for `labour`.
    labour: { include: { organization: { select: { id: true, name: true } } } },
    // Study: Start the nested value for `assignment`.
    assignment: {
        // Study: Load related database records with the main result.
        include: {
            // Study: Start the nested value for `project`.
            project: { include: { organization: { select: { id: true, name: true } } } },
            // Study: Start the nested value for `contractor`.
            contractor: { include: { organization: { select: { id: true, name: true } } } },
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    },
// Study: Close the object literal.
};

// Study: Export `findById` as an async function that returns a promise.
export const findById = async (id: string, organizationId: string) => {
    // Study: Return `await prisma.labourAssignment.findFirst({ where: { id, assignment: { project: { org…` to the caller.
    return await prisma.labourAssignment.findFirst({
        // Study: Set the conditions that database records must match using id, assignment.
        where: {
            // Study: Pass the current `id` value under the same property name.
            id,
            // Study: Start the nested value for `assignment`.
            assignment: {
                // Study: Start the nested value for `project`.
                project: {
                    // Study: Pass the current `organizationId` value under the same property name.
                    organizationId,
                // Study: Close the object literal.
                },
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        },
        // Study: Load related database records with the main result using `defaultIncludes`.
        include: defaultIncludes,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findMany` as an async function that returns a promise.
export const findMany = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `filters` with type `{ labourId?: string; contractorProjectAssignmentId?: string; status?: Prisma.EnumLa…` with initial value `{}`.
    filters: {
        // Study: Define `labourId` as optional with type `string`.
        labourId?: string;
        // Study: Define `contractorProjectAssignmentId` as optional with type `string`.
        contractorProjectAssignmentId?: string;
        // Study: Define `status` as optional with type `Prisma.EnumLabourAssignmentStatusFilter | "ACTIVE" | "COMPLETED" | "CANCELLED"`.
        status?: Prisma.EnumLabourAssignmentStatusFilter | "ACTIVE" | "COMPLETED" | "CANCELLED";
    // Study: Close this group and continue the enclosing expression.
    } = {}
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.labourAssignment.findMany({ where: { assignment: { project: { organiza…` to the caller.
    return await prisma.labourAssignment.findMany({
        // Study: Set the conditions that database records must match using assignment.
        where: {
            // Study: Start the nested value for `assignment`.
            assignment: {
                // Study: Start the nested value for `project`.
                project: {
                    // Study: Pass the current `organizationId` value under the same property name.
                    organizationId,
                // Study: Close the object literal.
                },
            // Study: Close the object literal.
            },
            // Study: Expand the values from `(filters.labourId && { labourId: filters.labourId })` into the surrounding collection.
            ...(filters.labourId && { labourId: filters.labourId }),
            // Study: Expand the values from `(filters.contractorProjectAssignmentId && { contractorProjectAssignmentId: filters.…` into the surrounding collection.
            ...(filters.contractorProjectAssignmentId && { contractorProjectAssignmentId: filters.contractorProjectAssignmentId }),
            // Study: Expand the values from `(filters.status && { status: filters.status })` into the surrounding collection.
            ...(filters.status && { status: filters.status }),
        // Study: Close the object literal.
        },
        // Study: Load related database records with the main result using `defaultIncludes`.
        include: defaultIncludes,
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `startDate` to `"desc"`.
            startDate: "desc",
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findAllPlatform` as an async function that returns a promise.
export const findAllPlatform = async (filters: {
    // Study: Define `labourId` as optional with type `string`.
    labourId?: string;
    // Study: Define `contractorProjectAssignmentId` as optional with type `string`.
    contractorProjectAssignmentId?: string;
    // Study: Define `status` as optional with type `Prisma.EnumLabourAssignmentStatusFilter | "ACTIVE" | "COMPLETED" | "CANCELLED"`.
    status?: Prisma.EnumLabourAssignmentStatusFilter | "ACTIVE" | "COMPLETED" | "CANCELLED";
// Study: Fetch records matching the query through `prisma.labourAssignment`.
} = {}) => prisma.labourAssignment.findMany({
    // Study: Set the conditions that database records must match.
    where: {
        // Study: Expand the values from `(filters.labourId && { labourId: filters.labourId })` into the surrounding collection.
        ...(filters.labourId && { labourId: filters.labourId }),
        // Study: Expand the values from `(filters.contractorProjectAssignmentId && { contractorProjectAssignmentId: filters.…` into the surrounding collection.
        ...(filters.contractorProjectAssignmentId && { contractorProjectAssignmentId: filters.contractorProjectAssignmentId }),
        // Study: Expand the values from `(filters.status && { status: filters.status })` into the surrounding collection.
        ...(filters.status && { status: filters.status }),
    // Study: Close the object literal.
    },
    // Study: Load related database records with the main result using `defaultIncludes`.
    include: defaultIncludes,
    // Study: Set the sort order for the returned records.
    orderBy: { startDate: "desc" },
// Study: Close the object literal.
});

// Study: Export `findPlatformById` as an async function that returns a promise.
export const findPlatformById = async (id: string) => prisma.labourAssignment.findUnique({
    // Study: Set the conditions that database records must match using id.
    where: { id },
    // Study: Load related database records with the main result using `defaultIncludes`.
    include: defaultIncludes,
// Study: Close the object literal.
});

// Study: Export `findByLabour` as an async function that returns a promise.
export const findByLabour = async (labourId: string, organizationId: string) => {
    // Study: Return `await prisma.labourAssignment.findMany({ where: { labourId, assignment: { project: …` to the caller.
    return await prisma.labourAssignment.findMany({
        // Study: Set the conditions that database records must match using labourId, assignment.
        where: {
            // Study: Pass the current `labourId` value under the same property name.
            labourId,
            // Study: Start the nested value for `assignment`.
            assignment: {
                // Study: Start the nested value for `project`.
                project: {
                    // Study: Pass the current `organizationId` value under the same property name.
                    organizationId,
                // Study: Close the object literal.
                },
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        },
        // Study: Load related database records with the main result using `defaultIncludes`.
        include: defaultIncludes,
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `startDate` to `"desc"`.
            startDate: "desc",
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findOverlappingAssignments` as an async function that returns a promise.
export const findOverlappingAssignments = async (
    // Study: Accept `labourId` with type `string`.
    labourId: string,
    // Study: Accept `startDate` with type `Date`.
    startDate: Date,
    // Study: Accept `endDate` with type `Date`.
    endDate: Date,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `excludeId` as optional with type `string`.
    excludeId?: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Build the object `whereClause` with the entries below.
    const whereClause: Prisma.LabourAssignmentWhereInput = {
        // Study: Pass the current `labourId` value under the same property name.
        labourId,
        // Study: Start the nested value for `startDate`.
        startDate: {
            // Study: Set `lte` to `endDate`.
            lte: endDate,
        // Study: Close the object literal.
        },
        // Study: Start the nested value for `endDate`.
        endDate: {
            // Study: Set `gte` to `startDate`.
            gte: startDate,
        // Study: Close the object literal.
        },
        // Study: Start the nested value for `assignment`.
        assignment: {
            // Study: Start the nested value for `project`.
            project: {
                // Study: Pass the current `organizationId` value under the same property name.
                organizationId,
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    };

    // Study: Run the following branch when `excludeId` is truthy.
    if (excludeId) {
        // Study: Assign `{ not: excludeId, }` to `whereClause.id`.
        whereClause.id = {
            // Study: Set `not` to `excludeId`.
            not: excludeId,
        // Study: Close the object literal.
        };
    // Study: Close the code block.
    }

    // Study: Return `await prisma.labourAssignment.findMany({ where: whereClause, include: defaultInclud…` to the caller.
    return await prisma.labourAssignment.findMany({
        // Study: Set `where` to `whereClause`.
        where: whereClause,
        // Study: Load related database records with the main result using `defaultIncludes`.
        include: defaultIncludes,
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `startDate` to `"asc"`.
            startDate: "asc",
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `create` as an async function that returns a promise.
export const create = async (data: Prisma.LabourAssignmentUncheckedCreateInput) => {
    // Study: Return `await prisma.labourAssignment.create({ data, include: defaultIncludes, })` to the caller.
    return await prisma.labourAssignment.create({
        // Study: Pass the current `data` value under the same property name.
        data,
        // Study: Load related database records with the main result using `defaultIncludes`.
        include: defaultIncludes,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `update` as an async function that returns a promise.
export const update = async (id: string, data: Prisma.LabourAssignmentUncheckedUpdateInput) => {
    // Study: Return `await prisma.labourAssignment.update({ where: { id }, data, include: defaultInclude…` to the caller.
    return await prisma.labourAssignment.update({
        // Study: Set the conditions that database records must match using id.
        where: { id },
        // Study: Pass the current `data` value under the same property name.
        data,
        // Study: Load related database records with the main result using `defaultIncludes`.
        include: defaultIncludes,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};
