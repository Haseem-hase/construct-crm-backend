// Study: This file is about which contractors work on which jobs and what they are responsible for. Takes information sent by the screen, asks the backend to do the work, and sends back the result.
// Study: Bring in `{ Request, Response, NextFunction }` from `"express"` so this file can use it.
import { Request, Response, NextFunction } from "express";
// Study: Bring in `* as assignmentService` from `"./contractor-project-assignment.service"` so this file can use it.
import * as assignmentService from "./contractor-project-assignment.service";
// Study: Bring in `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"` so this file can use it.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Bring in `{ ForbiddenError }` from `"../../errors/ForbiddenError"` so this file can use it.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Bring in `{ createContractorProjectAssignmentSchema, updateContractorProjectAssignmentSchema,…` from `"./contractor-project-assignment.validation"` so this file can use it.
import {
    // Study: Make `createContractorProjectAssignmentSchema` from the other file available here.
    createContractorProjectAssignmentSchema,
    // Study: Make `updateContractorProjectAssignmentSchema` from the other file available here.
    updateContractorProjectAssignmentSchema,
    // Study: Make `contractorProjectAssignmentIdSchema` from the other file available here.
    contractorProjectAssignmentIdSchema,
// Study: Finish this group and continue the surrounding step.
} from "./contractor-project-assignment.validation";
// Study: Bring in `{ ContractorAssignmentStatus }` from `"@prisma/client"` so this file can use it.
import { ContractorAssignmentStatus } from "@prisma/client";

// Study: Make `createAssignment` available to other files. Its result arrives after its work finishes.
export const createAssignment = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Check `req.body` using the rule `createContractorProjectAssignmentSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = createContractorProjectAssignmentSchema.parse(req.body);
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;

        // Study: Do the next step if this check passes: `!user.organizationId`.
        if (!user.organizationId) {
            // Study: Stop here and pass the problem onward: `new ForbiddenError( "User is not associated with an organization." )`.
            throw new ForbiddenError(
                // Study: Supply the literal string `"User is not associated with an organization."` here.
                "User is not associated with an organization."
            // Study: Close the current group.
            );
        // Study: End this group of steps.
        }

        // Study: Call `assignmentService.createAssignment` and wait for it to finish and store its result in `assignment`.
        const assignment = await assignmentService.createAssignment(
            // Study: Supply `user` to the surrounding statement.
            user.organizationId,
            // Study: Supply `validatedData` to the surrounding statement.
            validatedData
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(201).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Assignment created successfully."`.
            message: "Assignment created successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `assignment` into the new group under the same name.
                assignment,
            // Study: End this group of values.
            },
        // Study: End this group of values.
        });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `getAssignments` available to other files. Its result arrives after its work finishes.
export const getAssignments = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;

        // Study: Build the object `filters` with the entries below.
        const filters = {
            // Study: Set `projectId` to `req.query.projectId as string | undefined`.
            projectId: req.query.projectId as string | undefined,
            // Study: Set `contractorId` to `req.query.contractorId as string | undefined`.
            contractorId: req.query.contractorId as string | undefined,
            // Study: Set `status` to `req.query.status as ContractorAssignmentStatus | undefined`.
            status: req.query.status as ContractorAssignmentStatus | undefined,
        // Study: End this group of values.
        };

        // Study: Do the next step if this check passes: `!user.organizationId && user.systemRole !== "SUPER_ADMIN"` . If so, stop and report "This operation requires an organization context."
        if (!user.organizationId && user.systemRole !== "SUPER_ADMIN") throw new ForbiddenError("This operation requires an organization context.");
        // Study: Set `assignments` to `user.systemRole === "SUPER_ADMIN" ? await assignmentService.getPlatformAssignments(…`.
        const assignments = user.systemRole === "SUPER_ADMIN"
            // Study: Use this value if the check above passes.
            ? await assignmentService.getPlatformAssignments(filters)
            // Study: Use this value if the check above fails.
            : await assignmentService.getAssignments(user.organizationId!, filters);

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Assignments retrieved successfully."`.
            message: "Assignments retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `assignments` into the new group under the same name.
                assignments,
            // Study: End this group of values.
            },
        // Study: End this group of values.
        });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `getAssignmentById` available to other files. Its result arrives after its work finishes.
export const getAssignmentById = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;

        // Study: Check `req.params` using the rule `contractorProjectAssignmentIdSchema` and obtain the parsed value and store the result as `params`.
        const params = contractorProjectAssignmentIdSchema.parse(req.params);
        // Study: Do the next step if this check passes: `!user.organizationId && user.systemRole !== "SUPER_ADMIN"` . If so, stop and report "This operation requires an organization context."
        if (!user.organizationId && user.systemRole !== "SUPER_ADMIN") throw new ForbiddenError("This operation requires an organization context.");
        // Study: Set `assignment` to `user.systemRole === "SUPER_ADMIN" ? await assignmentService.getPlatformAssignmentBy…`.
        const assignment = user.systemRole === "SUPER_ADMIN"
            // Study: Use this value if the check above passes.
            ? await assignmentService.getPlatformAssignmentById(params.id)
            // Study: Use this value if the check above fails.
            : await assignmentService.getAssignmentById(user.organizationId!, params.id);

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Assignment retrieved successfully."`.
            message: "Assignment retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `assignment` into the new group under the same name.
                assignment,
            // Study: End this group of values.
            },
        // Study: End this group of values.
        });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `updateAssignment` available to other files. Its result arrives after its work finishes.
export const updateAssignment = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Check `req.body` using the rule `updateContractorProjectAssignmentSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = updateContractorProjectAssignmentSchema.parse(req.body);
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;

        // Study: Do the next step if this check passes: `!user.organizationId`.
        if (!user.organizationId) {
            // Study: Stop here and pass the problem onward: `new ForbiddenError( "User is not associated with an organization." )`.
            throw new ForbiddenError(
                // Study: Supply the literal string `"User is not associated with an organization."` here.
                "User is not associated with an organization."
            // Study: Close the current group.
            );
        // Study: End this group of steps.
        }

        // Study: Check `req.params` using the rule `contractorProjectAssignmentIdSchema` and obtain the parsed value and store the result as `params`.
        const params = contractorProjectAssignmentIdSchema.parse(req.params);

        // Study: Call `assignmentService.updateAssignment` and wait for it to finish and store its result in `assignment`.
        const assignment = await assignmentService.updateAssignment(
            // Study: Supply `user` to the surrounding statement.
            user.organizationId,
            // Study: Supply `params` to the surrounding statement.
            params.id,
            // Study: Supply `validatedData` to the surrounding statement.
            validatedData
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Assignment updated successfully."`.
            message: "Assignment updated successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `assignment` into the new group under the same name.
                assignment,
            // Study: End this group of values.
            },
        // Study: End this group of values.
        });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};
