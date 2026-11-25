// Study: This file is about which workers are assigned to each job. Takes information sent by the screen, asks the backend to do the work, and sends back the result.
// Study: Bring in `{ Request, Response, NextFunction }` from `"express"` so this file can use it.
import { Request, Response, NextFunction } from "express";
// Study: Bring in `* as labourAssignmentService` from `"./labour-assignment.service"` so this file can use it.
import * as labourAssignmentService from "./labour-assignment.service";
// Study: Bring in `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"` so this file can use it.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Bring in `{ ForbiddenError }` from `"../../errors/ForbiddenError"` so this file can use it.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Bring in `{ createLabourAssignmentSchema, updateLabourAssignmentSchema, labourAssignmentIdSch…` from `"./labour-assignment.validation"` so this file can use it.
import {
    // Study: Make `createLabourAssignmentSchema` from the other file available here.
    createLabourAssignmentSchema,
    // Study: Make `updateLabourAssignmentSchema` from the other file available here.
    updateLabourAssignmentSchema,
    // Study: Make `labourAssignmentIdSchema` from the other file available here.
    labourAssignmentIdSchema,
// Study: Finish this group and continue the surrounding step.
} from "./labour-assignment.validation";
// Study: Bring in `{ LabourAssignmentStatus }` from `"@prisma/client"` so this file can use it.
import { LabourAssignmentStatus } from "@prisma/client";

// Study: Make `createLabourAssignment` available to other files. Its result arrives after its work finishes.
export const createLabourAssignment = async (
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
        // Study: Check `req.body` using the rule `createLabourAssignmentSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = createLabourAssignmentSchema.parse(req.body);
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

        // Study: Call `labourAssignmentService.createAssignment` and wait for it to finish and store its result in `assignment`.
        const assignment = await labourAssignmentService.createAssignment(
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
            // Study: Set `message` to `"Labour assignment created successfully."`.
            message: "Labour assignment created successfully.",
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

// Study: Make `getLabourAssignments` available to other files. Its result arrives after its work finishes.
export const getLabourAssignments = async (
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
            // Study: Set `labourId` to `req.query.labourId as string | undefined`.
            labourId: req.query.labourId as string | undefined,
            // Study: Set `contractorProjectAssignmentId` to `req.query.contractorProjectAssignmentId as string | undefined`.
            contractorProjectAssignmentId: req.query.contractorProjectAssignmentId as string | undefined,
            // Study: Set `status` to `req.query.status as LabourAssignmentStatus | undefined`.
            status: req.query.status as LabourAssignmentStatus | undefined,
        // Study: End this group of values.
        };

        // Study: Do the next step if this check passes: `!user.organizationId && user.systemRole !== "SUPER_ADMIN"` . If so, stop and report "This operation requires an organization context."
        if (!user.organizationId && user.systemRole !== "SUPER_ADMIN") throw new ForbiddenError("This operation requires an organization context.");
        // Study: Set `assignments` to `user.systemRole === "SUPER_ADMIN" ? await labourAssignmentService.getPlatformAssign…`.
        const assignments = user.systemRole === "SUPER_ADMIN"
            // Study: Use this value if the check above passes.
            ? await labourAssignmentService.getPlatformAssignments(filters)
            // Study: Use this value if the check above fails.
            : await labourAssignmentService.getAssignments(user.organizationId!, filters);

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Labour assignments retrieved successfully."`.
            message: "Labour assignments retrieved successfully.",
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

// Study: Make `getLabourAssignmentById` available to other files. Its result arrives after its work finishes.
export const getLabourAssignmentById = async (
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

        // Study: Check `req.params` using the rule `labourAssignmentIdSchema` and obtain the parsed value and store the result as `params`.
        const params = labourAssignmentIdSchema.parse(req.params);
        // Study: Do the next step if this check passes: `!user.organizationId && user.systemRole !== "SUPER_ADMIN"` . If so, stop and report "This operation requires an organization context."
        if (!user.organizationId && user.systemRole !== "SUPER_ADMIN") throw new ForbiddenError("This operation requires an organization context.");
        // Study: Set `assignment` to `user.systemRole === "SUPER_ADMIN" ? await labourAssignmentService.getPlatformAssign…`.
        const assignment = user.systemRole === "SUPER_ADMIN"
            // Study: Use this value if the check above passes.
            ? await labourAssignmentService.getPlatformAssignmentById(params.id)
            // Study: Use this value if the check above fails.
            : await labourAssignmentService.getAssignmentById(user.organizationId!, params.id);

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Labour assignment retrieved successfully."`.
            message: "Labour assignment retrieved successfully.",
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

// Study: Make `updateLabourAssignment` available to other files. Its result arrives after its work finishes.
export const updateLabourAssignment = async (
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
        // Study: Check `req.body` using the rule `updateLabourAssignmentSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = updateLabourAssignmentSchema.parse(req.body);
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

        // Study: Check `req.params` using the rule `labourAssignmentIdSchema` and obtain the parsed value and store the result as `params`.
        const params = labourAssignmentIdSchema.parse(req.params);

        // Study: Call `labourAssignmentService.updateAssignment` and wait for it to finish and store its result in `assignment`.
        const assignment = await labourAssignmentService.updateAssignment(
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
            // Study: Set `message` to `"Labour assignment updated successfully."`.
            message: "Labour assignment updated successfully.",
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
