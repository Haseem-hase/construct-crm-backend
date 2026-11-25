// Study: Translate HTTP requests into service calls and send HTTP responses for worker records and their professions.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";

// Study: Import `* as labourService` from `"./labour.service"`.
import * as labourService from "./labour.service";

// Study: Import `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"`.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Import `{ ForbiddenError }` from `"../../errors/ForbiddenError"`.
import { ForbiddenError } from "../../errors/ForbiddenError";

// Study: Import `{ createLabourSchema, updateLabourSchema, labourIdSchema, }` from `"./labour.validation"`.
import {
    // Study: Bring `createLabourSchema` into scope from the imported module.
    createLabourSchema,
    // Study: Bring `updateLabourSchema` into scope from the imported module.
    updateLabourSchema,
    // Study: Bring `labourIdSchema` into scope from the imported module.
    labourIdSchema,
// Study: Close this group and continue the enclosing expression.
} from "./labour.validation";

// Create Labour
// Study: Export `createLabour` as an async function that returns a promise.
export const createLabour = async (
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

        // Study: Validate `{ ...req.body, ...(req.file ? { profileImageUrl: '/uploads/labour/${user.organizati…` with `createLabourSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = createLabourSchema.parse({
            // Study: Expand the values from `req.body` into the surrounding collection.
            ...req.body,
            // Study: Expand the values from `(req.file ? { profileImageUrl: '/uploads/labour/${user.organizationId}/${req.file.f…` into the surrounding collection.
            ...(req.file ? { profileImageUrl: `/uploads/labour/${user.organizationId}/${req.file.filename}` } : {}),
        // Study: Close the object literal.
        });

        // Study: Call `labourService.createLabour` and wait for it to finish and store its result in `labour`.
        const labour = await labourService.createLabour(
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
            // Study: Set `message` to `"Labour created successfully."`.
            message: "Labour created successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `labour` value under the same property name.
                labour,
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

// Get Organization Labours
// Study: Export `getOrganizationLabours` as an async function that returns a promise.
export const getOrganizationLabours = async (
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

        // Study: Run the following branch when `user.systemRole === "SUPER_ADMIN"` is truthy.
        if (user.systemRole === "SUPER_ADMIN") {
            // Study: Call `labourService.getPlatformLabours` and wait for it to finish and store its result in `labours`.
            const labours = await labourService.getPlatformLabours();
            // Study: Send a JSON response to the client.
            res.status(200).json({ success: true, message: "Labours retrieved successfully.", data: { labours } });
            // Study: Exit the function here.
            return;
        // Study: Close the code block.
        }
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

        // Study: Call `labourService.getOrganizationLabours` and wait for it to finish and store its result in `labours`.
        const labours = await labourService.getOrganizationLabours(
            // Study: Supply `user` to the surrounding statement.
            user.organizationId
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Labours retrieved successfully."`.
            message: "Labours retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `labours` value under the same property name.
                labours,
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

// Get Labour By ID
// Study: Export `getLabourById` as an async function that returns a promise.
export const getLabourById = async (
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
        // Study: Validate `req.params` with `labourIdSchema` and obtain the parsed value and store the result as `params`.
        const params = labourIdSchema.parse(req.params);
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Run the following branch when `user.systemRole === "SUPER_ADMIN"` is truthy.
        if (user.systemRole === "SUPER_ADMIN") {
            // Study: Call `labourService.getPlatformLabourById` and wait for it to finish and store its result in `labour`.
            const labour = await labourService.getPlatformLabourById(params.id);
            // Study: Send a JSON response to the client.
            res.status(200).json({ success: true, message: "Labour retrieved successfully.", data: { labour } });
            // Study: Exit the function here.
            return;
        // Study: Close the code block.
        }
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

        // Study: Call `labourService.getLabourById` and wait for it to finish and store its result in `labour`.
        const labour = await labourService.getLabourById(
            // Study: Supply `params` to the surrounding statement.
            params.id,
            // Study: Supply `user` to the surrounding statement.
            user.organizationId
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Labour retrieved successfully."`.
            message: "Labour retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `labour` value under the same property name.
                labour,
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

// Update Labour
// Study: Export `updateLabour` as an async function that returns a promise.
export const updateLabour = async (
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
        // Study: Validate `req.params` with `labourIdSchema` and obtain the parsed value and store the result as `params`.
        const params = labourIdSchema.parse(req.params);
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

        // Study: Validate `{ ...req.body, ...(req.file ? { profileImageUrl: '/uploads/labour/${user.organizati…` with `updateLabourSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = updateLabourSchema.parse({
            // Study: Expand the values from `req.body` into the surrounding collection.
            ...req.body,
            // Study: Expand the values from `(req.file ? { profileImageUrl: '/uploads/labour/${user.organizationId}/${req.file.f…` into the surrounding collection.
            ...(req.file ? { profileImageUrl: `/uploads/labour/${user.organizationId}/${req.file.filename}` } : {}),
        // Study: Close the object literal.
        });

        // Study: Call `labourService.updateLabour` and wait for it to finish and store its result in `labour`.
        const labour = await labourService.updateLabour(
            // Study: Supply `params` to the surrounding statement.
            params.id,
            // Study: Supply `user` to the surrounding statement.
            user.organizationId,
            // Study: Supply `validatedData` to the surrounding statement.
            validatedData
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Labour updated successfully."`.
            message: "Labour updated successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `labour` value under the same property name.
                labour,
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
