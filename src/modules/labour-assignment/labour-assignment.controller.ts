// Study: Translate HTTP requests into service calls and send HTTP responses for worker placements on construction projects.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";
// Study: Import `* as labourAssignmentService` from `"./labour-assignment.service"`.
import * as labourAssignmentService from "./labour-assignment.service";
// Study: Import `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"`.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Import `{ ForbiddenError }` from `"../../errors/ForbiddenError"`.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Import `{ createLabourAssignmentSchema, updateLabourAssignmentSchema, labourAssignmentIdSch…` from `"./labour-assignment.validation"`.
import {
    // Study: Bring `createLabourAssignmentSchema` into scope from the imported module.
    createLabourAssignmentSchema,
    // Study: Bring `updateLabourAssignmentSchema` into scope from the imported module.
    updateLabourAssignmentSchema,
    // Study: Bring `labourAssignmentIdSchema` into scope from the imported module.
    labourAssignmentIdSchema,
// Study: Close this group and continue the enclosing expression.
} from "./labour-assignment.validation";
// Study: Import `{ LabourAssignmentStatus }` from `"@prisma/client"`.
import { LabourAssignmentStatus } from "@prisma/client";

// Study: Export `createLabourAssignment` as an async function that returns a promise.
export const createLabourAssignment = async (
    // Study: Accept `req` with type `Request`.
    req: Request,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Validate `req.body` with `createLabourAssignmentSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = createLabourAssignmentSchema.parse(req.body);
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Run the following branch when `!user.organizationId` is truthy.
        if (!user.organizationId) {
            // Study: Stop this execution path by throwing `new ForbiddenError( "User is not associated with an organization." )`.
            throw new ForbiddenError(
                // Study: Supply the literal string `"User is not associated with an organization."` here.
                "User is not associated with an organization."
            // Study: Close the current group.
            );
        // Study: Close the code block.
        }

        // Study: Call `labourAssignmentService.createAssignment` and wait for it to finish and store its result in `assignment`.
        const assignment = await labourAssignmentService.createAssignment(
            // Study: Supply `user` to the surrounding statement.
            user.organizationId,
            // Study: Supply `validatedData` to the surrounding statement.
            validatedData
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(201).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Labour assignment created successfully."`.
            message: "Labour assignment created successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `assignment` value under the same property name.
                assignment,
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `getLabourAssignments` as an async function that returns a promise.
export const getLabourAssignments = async (
    // Study: Accept `req` with type `Request`.
    req: Request,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Build the object `filters` with the entries below.
        const filters = {
            // Study: Set `labourId` to `req.query.labourId as string | undefined`.
            labourId: req.query.labourId as string | undefined,
            // Study: Set `contractorProjectAssignmentId` to `req.query.contractorProjectAssignmentId as string | undefined`.
            contractorProjectAssignmentId: req.query.contractorProjectAssignmentId as string | undefined,
            // Study: Set `status` to `req.query.status as LabourAssignmentStatus | undefined`.
            status: req.query.status as LabourAssignmentStatus | undefined,
        // Study: Close the object literal.
        };

        // Study: Run the following branch when `!user.organizationId && user.systemRole !== "SUPER_ADMIN"` is truthy and throw `new ForbiddenError("This operation requires an organization context.")`.
        if (!user.organizationId && user.systemRole !== "SUPER_ADMIN") throw new ForbiddenError("This operation requires an organization context.");
        // Study: Set `assignments` to `user.systemRole === "SUPER_ADMIN" ? await labourAssignmentService.getPlatformAssign…`.
        const assignments = user.systemRole === "SUPER_ADMIN"
            // Study: Use this value when the preceding condition is truthy.
            ? await labourAssignmentService.getPlatformAssignments(filters)
            // Study: Use this value when the preceding condition is falsy.
            : await labourAssignmentService.getAssignments(user.organizationId!, filters);

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Labour assignments retrieved successfully."`.
            message: "Labour assignments retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `assignments` value under the same property name.
                assignments,
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `getLabourAssignmentById` as an async function that returns a promise.
export const getLabourAssignmentById = async (
    // Study: Accept `req` with type `Request`.
    req: Request,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Validate `req.params` with `labourAssignmentIdSchema` and obtain the parsed value and store the result as `params`.
        const params = labourAssignmentIdSchema.parse(req.params);
        // Study: Run the following branch when `!user.organizationId && user.systemRole !== "SUPER_ADMIN"` is truthy and throw `new ForbiddenError("This operation requires an organization context.")`.
        if (!user.organizationId && user.systemRole !== "SUPER_ADMIN") throw new ForbiddenError("This operation requires an organization context.");
        // Study: Set `assignment` to `user.systemRole === "SUPER_ADMIN" ? await labourAssignmentService.getPlatformAssign…`.
        const assignment = user.systemRole === "SUPER_ADMIN"
            // Study: Use this value when the preceding condition is truthy.
            ? await labourAssignmentService.getPlatformAssignmentById(params.id)
            // Study: Use this value when the preceding condition is falsy.
            : await labourAssignmentService.getAssignmentById(user.organizationId!, params.id);

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Labour assignment retrieved successfully."`.
            message: "Labour assignment retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `assignment` value under the same property name.
                assignment,
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `updateLabourAssignment` as an async function that returns a promise.
export const updateLabourAssignment = async (
    // Study: Accept `req` with type `Request`.
    req: Request,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Validate `req.body` with `updateLabourAssignmentSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = updateLabourAssignmentSchema.parse(req.body);
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Run the following branch when `!user.organizationId` is truthy.
        if (!user.organizationId) {
            // Study: Stop this execution path by throwing `new ForbiddenError( "User is not associated with an organization." )`.
            throw new ForbiddenError(
                // Study: Supply the literal string `"User is not associated with an organization."` here.
                "User is not associated with an organization."
            // Study: Close the current group.
            );
        // Study: Close the code block.
        }

        // Study: Validate `req.params` with `labourAssignmentIdSchema` and obtain the parsed value and store the result as `params`.
        const params = labourAssignmentIdSchema.parse(req.params);

        // Study: Call `labourAssignmentService.updateAssignment` and wait for it to finish and store its result in `assignment`.
        const assignment = await labourAssignmentService.updateAssignment(
            // Study: Supply `user` to the surrounding statement.
            user.organizationId,
            // Study: Supply `params` to the surrounding statement.
            params.id,
            // Study: Supply `validatedData` to the surrounding statement.
            validatedData
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Labour assignment updated successfully."`.
            message: "Labour assignment updated successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `assignment` value under the same property name.
                assignment,
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};
