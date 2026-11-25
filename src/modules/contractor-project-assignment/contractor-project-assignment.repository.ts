// Study: Read and write database records through Prisma for contractor placements on projects and their responsibilities.
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";
// Study: Import `{ ContractorAssignmentStatus }` from `"@prisma/client"`.
import { ContractorAssignmentStatus } from "@prisma/client";

// Study: Build the object `defaultIncludes` with the entries below.
const defaultIncludes = {
    // Study: Start the nested value for `project`.
    project: { include: { organization: { select: { id: true, name: true } } } },
    // Study: Start the nested value for `contractor`.
    contractor: { include: { organization: { select: { id: true, name: true } } } },
    // Study: Start the nested value for `responsibilities`.
    responsibilities: {
        // Study: Load related database records with the main result.
        include: {
            // Study: Set `responsibility` to `true`.
            responsibility: true,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    },
// Study: Close the object literal.
};

// Study: Export `findById` as an async function that returns a promise.
export const findById = async (id: string) => {
    // Study: Return `await prisma.contractorProjectAssignment.findUnique({ where: { id }, include: defau…` to the caller.
    return await prisma.contractorProjectAssignment.findUnique({
        // Study: Set the conditions that database records must match using id.
        where: { id },
        // Study: Load related database records with the main result using `defaultIncludes`.
        include: defaultIncludes,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findMany` as an async function that returns a promise.
export const findMany = async (organizationId: string, filters: {
    // Study: Define `projectId` as optional with type `string`.
    projectId?: string;
    // Study: Define `contractorId` as optional with type `string`.
    contractorId?: string;
    // Study: Define `status` as optional with type `ContractorAssignmentStatus`.
    status?: ContractorAssignmentStatus;
// Study: Close this group and continue the enclosing expression.
} = {}) => {
    // Study: Return `await prisma.contractorProjectAssignment.findMany({ where: { project: { organizatio…` to the caller.
    return await prisma.contractorProjectAssignment.findMany({
        // Study: Set the conditions that database records must match using project.
        where: {
            // Study: Start the nested value for `project`.
            project: {
                // Study: Pass the current `organizationId` value under the same property name.
                organizationId,
            // Study: Close the object literal.
            },
            // Study: Expand the values from `(filters.projectId && { projectId: filters.projectId })` into the surrounding collection.
            ...(filters.projectId && { projectId: filters.projectId }),
            // Study: Expand the values from `(filters.contractorId && { contractorId: filters.contractorId })` into the surrounding collection.
            ...(filters.contractorId && { contractorId: filters.contractorId }),
            // Study: Expand the values from `(filters.status && { status: filters.status })` into the surrounding collection.
            ...(filters.status && { status: filters.status }),
        // Study: Close the object literal.
        },
        // Study: Load related database records with the main result using `defaultIncludes`.
        include: defaultIncludes,
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `createdAt` to `"desc"`.
            createdAt: "desc",
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findAllPlatform` as an async function that returns a promise.
export const findAllPlatform = async (filters: {
    // Study: Define `projectId` as optional with type `string`.
    projectId?: string;
    // Study: Define `contractorId` as optional with type `string`.
    contractorId?: string;
    // Study: Define `status` as optional with type `ContractorAssignmentStatus`.
    status?: ContractorAssignmentStatus;
// Study: Fetch records matching the query through `prisma.contractorProjectAssignment`.
} = {}) => prisma.contractorProjectAssignment.findMany({
    // Study: Set the conditions that database records must match.
    where: {
        // Study: Expand the values from `(filters.projectId && { projectId: filters.projectId })` into the surrounding collection.
        ...(filters.projectId && { projectId: filters.projectId }),
        // Study: Expand the values from `(filters.contractorId && { contractorId: filters.contractorId })` into the surrounding collection.
        ...(filters.contractorId && { contractorId: filters.contractorId }),
        // Study: Expand the values from `(filters.status && { status: filters.status })` into the surrounding collection.
        ...(filters.status && { status: filters.status }),
    // Study: Close the object literal.
    },
    // Study: Load related database records with the main result using `defaultIncludes`.
    include: defaultIncludes,
    // Study: Set the sort order for the returned records.
    orderBy: { createdAt: "desc" },
// Study: Close the object literal.
});

// Study: Export `findByProjectAndContractor` as an async function that returns a promise.
export const findByProjectAndContractor = async (projectId: string, contractorId: string) => {
    // Study: Return `await prisma.contractorProjectAssignment.findUnique({ where: { projectId_contractor…` to the caller.
    return await prisma.contractorProjectAssignment.findUnique({
        // Study: Set the conditions that database records must match using projectId_contractorId.
        where: {
            // Study: Start the nested value for `projectId_contractorId`.
            projectId_contractorId: {
                // Study: Pass the current `projectId` value under the same property name.
                projectId,
                // Study: Pass the current `contractorId` value under the same property name.
                contractorId,
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

// Study: Export `create` as an async function that returns a promise.
export const create = async (data: {
    // Study: Define `projectId` with type `string`.
    projectId: string;
    // Study: Define `contractorId` with type `string`.
    contractorId: string;
    // Study: Define `scopeDescription` as optional with type `string`.
    scopeDescription?: string;
    // Study: Define `startDate` as optional with type `Date`.
    startDate?: Date;
    // Study: Define `endDate` as optional with type `Date`.
    endDate?: Date;
    // Study: Define `notes` as optional with type `string`.
    notes?: string;
    // Study: Define `responsibilityIds` as optional with type `string[]`.
    responsibilityIds?: string[];
// Study: Close this group and continue the enclosing expression.
}) => {
    // Study: Return `await prisma.$transaction(async (tx) => { const assignment = await tx.contractorPro…` to the caller.
    return await prisma.$transaction(async (tx) => {
        // Study: Insert a new record through `tx.contractorProjectAssignment` and wait for it to finish and store its result in `assignment`.
        const assignment = await tx.contractorProjectAssignment.create({
            // Study: Supply the values to write to the database.
            data: {
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
                // Study: Set `status` to `"PENDING"`.
                status: "PENDING",
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        });

        // Study: Run the following branch when `data.responsibilityIds && data.responsibilityIds.length > 0` is truthy.
        if (data.responsibilityIds && data.responsibilityIds.length > 0) {
            // Study: Insert multiple records through `tx.contractorProjectAssignmentResponsibility` and wait for it to finish.
            await tx.contractorProjectAssignmentResponsibility.createMany({
                // Study: Set `data` to `data.responsibilityIds.map((respId) => ({ assignmentId: assignment.id, responsibili…`.
                data: data.responsibilityIds.map((respId) => ({
                    // Study: Set `assignmentId` to `assignment.id`.
                    assignmentId: assignment.id,
                    // Study: Set `responsibilityId` to `respId`.
                    responsibilityId: respId,
                // Study: Close the object literal.
                })),
            // Study: Close the object literal.
            });
        // Study: Close the code block.
        }

        // Study: Return `await tx.contractorProjectAssignment.findUniqueOrThrow({ where: { id: assignment.id…` to the caller.
        return await tx.contractorProjectAssignment.findUniqueOrThrow({
            // Study: Set the conditions that database records must match using id.
            where: { id: assignment.id },
            // Study: Load related database records with the main result using `defaultIncludes`.
            include: defaultIncludes,
        // Study: Close the object literal.
        });
    // Study: Close the code block.
    });
// Study: Close the code block.
};

// Study: Export `update` as an async function that returns a promise.
export const update = async (
    // Study: Accept `assignmentId` with type `string`.
    assignmentId: string,
    // Study: Accept `data` with type `{ scopeDescription?: string | null; startDate?: Date | null; endDate?: Date | null;…`.
    data: {
        // Study: Define `scopeDescription` as optional with type `string | null`.
        scopeDescription?: string | null;
        // Study: Define `startDate` as optional with type `Date | null`.
        startDate?: Date | null;
        // Study: Define `endDate` as optional with type `Date | null`.
        endDate?: Date | null;
        // Study: Define `notes` as optional with type `string | null`.
        notes?: string | null;
        // Study: Define `status` as optional with type `ContractorAssignmentStatus`.
        status?: ContractorAssignmentStatus;
        // Study: Define `responsibilityIds` as optional with type `string[]`.
        responsibilityIds?: string[];
        // Study: Define `cancelActiveLabourAssignments` as optional with type `boolean`.
        cancelActiveLabourAssignments?: boolean;
    // Study: Close the object type.
    }
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.$transaction(async (tx) => { const updatedAssignment = await tx.contra…` to the caller.
    return await prisma.$transaction(async (tx) => {
        // Study: Update the uniquely identified record through `tx.contractorProjectAssignment` and wait for it to finish and store its result in `updatedAssignment`.
        const updatedAssignment = await tx.contractorProjectAssignment.update({
            // Study: Set the conditions that database records must match using id.
            where: { id: assignmentId },
            // Study: Supply the values to write to the database.
            data: {
                // Study: Expand the values from `(data.scopeDescription !== undefined && { scopeDescription: data.scopeDescription })` into the surrounding collection.
                ...(data.scopeDescription !== undefined && { scopeDescription: data.scopeDescription }),
                // Study: Expand the values from `(data.startDate !== undefined && { startDate: data.startDate })` into the surrounding collection.
                ...(data.startDate !== undefined && { startDate: data.startDate }),
                // Study: Expand the values from `(data.endDate !== undefined && { endDate: data.endDate })` into the surrounding collection.
                ...(data.endDate !== undefined && { endDate: data.endDate }),
                // Study: Expand the values from `(data.notes !== undefined && { notes: data.notes })` into the surrounding collection.
                ...(data.notes !== undefined && { notes: data.notes }),
                // Study: Expand the values from `(data.status !== undefined && { status: data.status })` into the surrounding collection.
                ...(data.status !== undefined && { status: data.status }),
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        });

        // Study: Run the following branch when `data.cancelActiveLabourAssignments` is truthy.
        if (data.cancelActiveLabourAssignments) {
            // Study: Update all records matching the filters through `tx.labourAssignment` and wait for it to finish.
            await tx.labourAssignment.updateMany({
                // Study: Set the conditions that database records must match using contractorProjectAssignmentId, status.
                where: {
                    // Study: Set `contractorProjectAssignmentId` to `assignmentId`.
                    contractorProjectAssignmentId: assignmentId,
                    // Study: Set `status` to `"ACTIVE"`.
                    status: "ACTIVE",
                // Study: Close the object literal.
                },
                // Study: Supply the values to write to the database.
                data: {
                    // Study: Set `status` to `"CANCELLED"`.
                    status: "CANCELLED",
                // Study: Close the object literal.
                },
            // Study: Close the object literal.
            });
        // Study: Close the code block.
        }

        // Study: Run the following branch when `data.responsibilityIds !== undefined` is truthy.
        if (data.responsibilityIds !== undefined) {
            // Remove existing responsibilities
            // Study: Delete records matching the filters through `tx.contractorProjectAssignmentResponsibility` and wait for it to finish.
            await tx.contractorProjectAssignmentResponsibility.deleteMany({
                // Study: Set the conditions that database records must match using assignmentId.
                where: { assignmentId },
            // Study: Close the object literal.
            });

            // Add new responsibilities if provided
            // Study: Run the following branch when `data.responsibilityIds.length > 0` is truthy.
            if (data.responsibilityIds.length > 0) {
                // Study: Insert multiple records through `tx.contractorProjectAssignmentResponsibility` and wait for it to finish.
                await tx.contractorProjectAssignmentResponsibility.createMany({
                    // Study: Set `data` to `data.responsibilityIds.map((respId) => ({ assignmentId, responsibilityId: respId, }))`.
                    data: data.responsibilityIds.map((respId) => ({
                        // Study: Pass the current `assignmentId` value under the same property name.
                        assignmentId,
                        // Study: Set `responsibilityId` to `respId`.
                        responsibilityId: respId,
                    // Study: Close the object literal.
                    })),
                // Study: Close the object literal.
                });
            // Study: Close the code block.
            }
        // Study: Close the code block.
        }

        // Study: Return `await tx.contractorProjectAssignment.findUniqueOrThrow({ where: { id: updatedAssign…` to the caller.
        return await tx.contractorProjectAssignment.findUniqueOrThrow({
            // Study: Set the conditions that database records must match using id.
            where: { id: updatedAssignment.id },
            // Study: Load related database records with the main result using `defaultIncludes`.
            include: defaultIncludes,
        // Study: Close the object literal.
        });
    // Study: Close the code block.
    });
// Study: Close the code block.
};
