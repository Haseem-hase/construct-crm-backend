// Study: This file is about which contractors work on which jobs and what they are responsible for. Finds or saves information in the database, where the CRM keeps its records.
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";
// Study: Bring in `{ ContractorAssignmentStatus }` from `"@prisma/client"` so this file can use it.
import { ContractorAssignmentStatus } from "@prisma/client";

// Study: Build the object `defaultIncludes` with the entries below.
const defaultIncludes = {
    // Study: Start the nested value for `project`.
    project: { include: { organization: { select: { id: true, name: true } } } },
    // Study: Start the nested value for `contractor`.
    contractor: { include: { organization: { select: { id: true, name: true } } } },
    // Study: Start the nested value for `responsibilities`.
    responsibilities: {
        // Study: Ask for linked information along with the main record.
        include: {
            // Study: Set `responsibility` to `true`.
            responsibility: true,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    },
// Study: End this group of values.
};

// Study: Make `findById` available to other files. Its result arrives after its work finishes.
export const findById = async (id: string) => {
    // Study: Give `await prisma.contractorProjectAssignment.findUnique({ where: { id }, include: defau…` back to the code that asked for it.
    return await prisma.contractorProjectAssignment.findUnique({
        // Study: Set the conditions that records must meet using id.
        where: { id },
        // Study: Ask for linked information along with the main record using `defaultIncludes`.
        include: defaultIncludes,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findMany` available to other files. Its result arrives after its work finishes.
export const findMany = async (organizationId: string, filters: {
    // Study: Define `projectId` as optional with type `string`.
    projectId?: string;
    // Study: Define `contractorId` as optional with type `string`.
    contractorId?: string;
    // Study: Define `status` as optional with type `ContractorAssignmentStatus`.
    status?: ContractorAssignmentStatus;
// Study: Finish this group and continue the surrounding step.
} = {}) => {
    // Study: Give `await prisma.contractorProjectAssignment.findMany({ where: { project: { organizatio…` back to the code that asked for it.
    return await prisma.contractorProjectAssignment.findMany({
        // Study: Set the conditions that records must meet using project.
        where: {
            // Study: Start the nested value for `project`.
            project: {
                // Study: Carry the value of `organizationId` into the new group under the same name.
                organizationId,
            // Study: End this group of values.
            },
            // Study: Expand the values from `(filters.projectId && { projectId: filters.projectId })` into the surrounding collection.
            ...(filters.projectId && { projectId: filters.projectId }),
            // Study: Expand the values from `(filters.contractorId && { contractorId: filters.contractorId })` into the surrounding collection.
            ...(filters.contractorId && { contractorId: filters.contractorId }),
            // Study: Expand the values from `(filters.status && { status: filters.status })` into the surrounding collection.
            ...(filters.status && { status: filters.status }),
        // Study: End this group of values.
        },
        // Study: Ask for linked information along with the main record using `defaultIncludes`.
        include: defaultIncludes,
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `createdAt` to `"desc"`.
            createdAt: "desc",
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findAllPlatform` available to other files. Its result arrives after its work finishes.
export const findAllPlatform = async (filters: {
    // Study: Define `projectId` as optional with type `string`.
    projectId?: string;
    // Study: Define `contractorId` as optional with type `string`.
    contractorId?: string;
    // Study: Define `status` as optional with type `ContractorAssignmentStatus`.
    status?: ContractorAssignmentStatus;
// Study: Find all matching records using `prisma.contractorProjectAssignment`.
} = {}) => prisma.contractorProjectAssignment.findMany({
    // Study: Set the conditions that records must meet.
    where: {
        // Study: Expand the values from `(filters.projectId && { projectId: filters.projectId })` into the surrounding collection.
        ...(filters.projectId && { projectId: filters.projectId }),
        // Study: Expand the values from `(filters.contractorId && { contractorId: filters.contractorId })` into the surrounding collection.
        ...(filters.contractorId && { contractorId: filters.contractorId }),
        // Study: Expand the values from `(filters.status && { status: filters.status })` into the surrounding collection.
        ...(filters.status && { status: filters.status }),
    // Study: End this group of values.
    },
    // Study: Ask for linked information along with the main record using `defaultIncludes`.
    include: defaultIncludes,
    // Study: Set the sort order for the returned records.
    orderBy: { createdAt: "desc" },
// Study: End this group of values.
});

// Study: Make `findByProjectAndContractor` available to other files. Its result arrives after its work finishes.
export const findByProjectAndContractor = async (projectId: string, contractorId: string) => {
    // Study: Give `await prisma.contractorProjectAssignment.findUnique({ where: { projectId_contractor…` back to the code that asked for it.
    return await prisma.contractorProjectAssignment.findUnique({
        // Study: Set the conditions that records must meet using projectId_contractorId.
        where: {
            // Study: Start the nested value for `projectId_contractorId`.
            projectId_contractorId: {
                // Study: Carry the value of `projectId` into the new group under the same name.
                projectId,
                // Study: Carry the value of `contractorId` into the new group under the same name.
                contractorId,
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

// Study: Make `create` available to other files. Its result arrives after its work finishes.
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
// Study: Finish this group and continue the surrounding step.
}) => {
    // Study: Give `await prisma.$transaction(async (tx) => { const assignment = await tx.contractorPro…` back to the code that asked for it.
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
            // Study: End this group of values.
            },
        // Study: End this group of values.
        });

        // Study: Do the next step if this check passes: `data.responsibilityIds && data.responsibilityIds.length > 0`.
        if (data.responsibilityIds && data.responsibilityIds.length > 0) {
            // Study: Insert multiple records through `tx.contractorProjectAssignmentResponsibility` and wait for it to finish.
            await tx.contractorProjectAssignmentResponsibility.createMany({
                // Study: Set `data` to `data.responsibilityIds.map((respId) => ({ assignmentId: assignment.id, responsibili…`.
                data: data.responsibilityIds.map((respId) => ({
                    // Study: Set `assignmentId` to `assignment.id`.
                    assignmentId: assignment.id,
                    // Study: Set `responsibilityId` to `respId`.
                    responsibilityId: respId,
                // Study: End this group of values.
                })),
            // Study: End this group of values.
            });
        // Study: End this group of steps.
        }

        // Study: Give `await tx.contractorProjectAssignment.findUniqueOrThrow({ where: { id: assignment.id…` back to the code that asked for it.
        return await tx.contractorProjectAssignment.findUniqueOrThrow({
            // Study: Set the conditions that records must meet using id.
            where: { id: assignment.id },
            // Study: Ask for linked information along with the main record using `defaultIncludes`.
            include: defaultIncludes,
        // Study: End this group of values.
        });
    // Study: End this group of steps.
    });
// Study: End this group of steps.
};

// Study: Make `update` available to other files. Its result arrives after its work finishes.
export const update = async (
    // Study: This step receives `assignmentId`. `string` describes what that information should look like.
    assignmentId: string,
    // Study: This step receives `data`. `{ scopeDescription?: string | null; startDate?: Date | null; endDate?: Date | null;…` describes what that information should look like.
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
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.$transaction(async (tx) => { const updatedAssignment = await tx.contra…` back to the code that asked for it.
    return await prisma.$transaction(async (tx) => {
        // Study: Update the uniquely identified record through `tx.contractorProjectAssignment` and wait for it to finish and store its result in `updatedAssignment`.
        const updatedAssignment = await tx.contractorProjectAssignment.update({
            // Study: Set the conditions that records must meet using id.
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
            // Study: End this group of values.
            },
        // Study: End this group of values.
        });

        // Study: Do the next step if this check passes: `data.cancelActiveLabourAssignments`.
        if (data.cancelActiveLabourAssignments) {
            // Study: Update all records matching the filters through `tx.labourAssignment` and wait for it to finish.
            await tx.labourAssignment.updateMany({
                // Study: Set the conditions that records must meet using contractorProjectAssignmentId, status.
                where: {
                    // Study: Set `contractorProjectAssignmentId` to `assignmentId`.
                    contractorProjectAssignmentId: assignmentId,
                    // Study: Set `status` to `"ACTIVE"`.
                    status: "ACTIVE",
                // Study: End this group of values.
                },
                // Study: Supply the values to write to the database.
                data: {
                    // Study: Set `status` to `"CANCELLED"`.
                    status: "CANCELLED",
                // Study: End this group of values.
                },
            // Study: End this group of values.
            });
        // Study: End this group of steps.
        }

        // Study: Do the next step if this check passes: `data.responsibilityIds !== undefined`.
        if (data.responsibilityIds !== undefined) {
            // Remove existing responsibilities
            // Study: Delete records matching the filters through `tx.contractorProjectAssignmentResponsibility` and wait for it to finish.
            await tx.contractorProjectAssignmentResponsibility.deleteMany({
                // Study: Set the conditions that records must meet using assignmentId.
                where: { assignmentId },
            // Study: End this group of values.
            });

            // Add new responsibilities if provided
            // Study: Do the next step if this check passes: `data.responsibilityIds.length > 0`.
            if (data.responsibilityIds.length > 0) {
                // Study: Insert multiple records through `tx.contractorProjectAssignmentResponsibility` and wait for it to finish.
                await tx.contractorProjectAssignmentResponsibility.createMany({
                    // Study: Set `data` to `data.responsibilityIds.map((respId) => ({ assignmentId, responsibilityId: respId, }))`.
                    data: data.responsibilityIds.map((respId) => ({
                        // Study: Carry the value of `assignmentId` into the new group under the same name.
                        assignmentId,
                        // Study: Set `responsibilityId` to `respId`.
                        responsibilityId: respId,
                    // Study: End this group of values.
                    })),
                // Study: End this group of values.
                });
            // Study: End this group of steps.
            }
        // Study: End this group of steps.
        }

        // Study: Give `await tx.contractorProjectAssignment.findUniqueOrThrow({ where: { id: updatedAssign…` back to the code that asked for it.
        return await tx.contractorProjectAssignment.findUniqueOrThrow({
            // Study: Set the conditions that records must meet using id.
            where: { id: updatedAssignment.id },
            // Study: Ask for linked information along with the main record using `defaultIncludes`.
            include: defaultIncludes,
        // Study: End this group of values.
        });
    // Study: End this group of steps.
    });
// Study: End this group of steps.
};
