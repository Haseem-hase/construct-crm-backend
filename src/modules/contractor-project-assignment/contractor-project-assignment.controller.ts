// Study: Translate HTTP requests into service calls and send HTTP responses for contractor placements on projects and their responsibilities.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";
// Study: Import `* as assignmentService` from `"./contractor-project-assignment.service"`.
import * as assignmentService from "./contractor-project-assignment.service";
// Study: Import `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"`.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Import `{ ForbiddenError }` from `"../../errors/ForbiddenError"`.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Import `{ createContractorProjectAssignmentSchema, updateContractorProjectAssignmentSchema,…` from `"./contractor-project-assignment.validation"`.
import {
    // Study: Bring `createContractorProjectAssignmentSchema` into scope from the imported module.
    createContractorProjectAssignmentSchema,
    // Study: Bring `updateContractorProjectAssignmentSchema` into scope from the imported module.
    updateContractorProjectAssignmentSchema,
    // Study: Bring `contractorProjectAssignmentIdSchema` into scope from the imported module.
    contractorProjectAssignmentIdSchema,
// Study: Close this group and continue the enclosing expression.
} from "./contractor-project-assignment.validation";
// Study: Import `{ ContractorAssignmentStatus }` from `"@prisma/client"`.
import { ContractorAssignmentStatus } from "@prisma/client";

// Study: Export `createAssignment` as an async function that returns a promise.
export const createAssignment = async (
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
        // Study: Validate `req.body` with `createContractorProjectAssignmentSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = createContractorProjectAssignmentSchema.parse(req.body);
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

        // Study: Call `assignmentService.createAssignment` and wait for it to finish and store its result in `assignment`.
        const assignment = await assignmentService.createAssignment(
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
            // Study: Set `message` to `"Assignment created successfully."`.
            message: "Assignment created successfully.",
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

// Study: Export `getAssignments` as an async function that returns a promise.
export const getAssignments = async (
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
            // Study: Set `projectId` to `req.query.projectId as string | undefined`.
            projectId: req.query.projectId as string | undefined,
            // Study: Set `contractorId` to `req.query.contractorId as string | undefined`.
            contractorId: req.query.contractorId as string | undefined,
            // Study: Set `status` to `req.query.status as ContractorAssignmentStatus | undefined`.
            status: req.query.status as ContractorAssignmentStatus | undefined,
        // Study: Close the object literal.
        };

        // Study: Run the following branch when `!user.organizationId && user.systemRole !== "SUPER_ADMIN"` is truthy and throw `new ForbiddenError("This operation requires an organization context.")`.
        if (!user.organizationId && user.systemRole !== "SUPER_ADMIN") throw new ForbiddenError("This operation requires an organization context.");
        // Study: Set `assignments` to `user.systemRole === "SUPER_ADMIN" ? await assignmentService.getPlatformAssignments(…`.
        const assignments = user.systemRole === "SUPER_ADMIN"
            // Study: Use this value when the preceding condition is truthy.
            ? await assignmentService.getPlatformAssignments(filters)
            // Study: Use this value when the preceding condition is falsy.
            : await assignmentService.getAssignments(user.organizationId!, filters);

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Assignments retrieved successfully."`.
            message: "Assignments retrieved successfully.",
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

// Study: Export `getAssignmentById` as an async function that returns a promise.
export const getAssignmentById = async (
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

        // Study: Validate `req.params` with `contractorProjectAssignmentIdSchema` and obtain the parsed value and store the result as `params`.
        const params = contractorProjectAssignmentIdSchema.parse(req.params);
        // Study: Run the following branch when `!user.organizationId && user.systemRole !== "SUPER_ADMIN"` is truthy and throw `new ForbiddenError("This operation requires an organization context.")`.
        if (!user.organizationId && user.systemRole !== "SUPER_ADMIN") throw new ForbiddenError("This operation requires an organization context.");
        // Study: Set `assignment` to `user.systemRole === "SUPER_ADMIN" ? await assignmentService.getPlatformAssignmentBy…`.
        const assignment = user.systemRole === "SUPER_ADMIN"
            // Study: Use this value when the preceding condition is truthy.
            ? await assignmentService.getPlatformAssignmentById(params.id)
            // Study: Use this value when the preceding condition is falsy.
            : await assignmentService.getAssignmentById(user.organizationId!, params.id);

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Assignment retrieved successfully."`.
            message: "Assignment retrieved successfully.",
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

// Study: Export `updateAssignment` as an async function that returns a promise.
export const updateAssignment = async (
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
        // Study: Validate `req.body` with `updateContractorProjectAssignmentSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = updateContractorProjectAssignmentSchema.parse(req.body);
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

        // Study: Validate `req.params` with `contractorProjectAssignmentIdSchema` and obtain the parsed value and store the result as `params`.
        const params = contractorProjectAssignmentIdSchema.parse(req.params);

        // Study: Call `assignmentService.updateAssignment` and wait for it to finish and store its result in `assignment`.
        const assignment = await assignmentService.updateAssignment(
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
            // Study: Set `message` to `"Assignment updated successfully."`.
            message: "Assignment updated successfully.",
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
