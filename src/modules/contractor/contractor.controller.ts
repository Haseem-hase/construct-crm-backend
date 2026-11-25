// Study: Translate HTTP requests into service calls and send HTTP responses for contractor records.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";

// Study: Import `* as contractorService` from `"./contractor.service"`.
import * as contractorService from "./contractor.service";

// Study: Import `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"`.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Import `{ ForbiddenError }` from `"../../errors/ForbiddenError"`.
import { ForbiddenError } from "../../errors/ForbiddenError";

// Study: Import `{ createContractorSchema, updateContractorSchema, contractorIdSchema, }` from `"./contractor.validation"`.
import {
    // Study: Bring `createContractorSchema` into scope from the imported module.
    createContractorSchema,
    // Study: Bring `updateContractorSchema` into scope from the imported module.
    updateContractorSchema,
    // Study: Bring `contractorIdSchema` into scope from the imported module.
    contractorIdSchema,
// Study: Close this group and continue the enclosing expression.
} from "./contractor.validation";

// Study: Export `createContractor` as an async function that returns a promise.
export const createContractor = async (
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

        // Study: Validate `{ ...req.body, ...(req.file ? { profileImageUrl: '/uploads/contractors/${user.organ…` with `createContractorSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = createContractorSchema.parse({
            // Study: Expand the values from `req.body` into the surrounding collection.
            ...req.body,
            // Study: Expand the values from `(req.file ? { profileImageUrl: '/uploads/contractors/${user.organizationId}/${req.f…` into the surrounding collection.
            ...(req.file ? { profileImageUrl: `/uploads/contractors/${user.organizationId}/${req.file.filename}` } : {}),
        // Study: Close the object literal.
        });

        // Study: Call `contractorService.createContractor` and wait for it to finish and store its result in `contractor`.
        const contractor = await contractorService.createContractor(
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
            // Study: Set `message` to `"Contractor created successfully."`.
            message: "Contractor created successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `contractor` value under the same property name.
                contractor,
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

// Study: Export `getOrganizationContractors` as an async function that returns a promise.
export const getOrganizationContractors = async (
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
            // Study: Call `contractorService.getPlatformContractors` and wait for it to finish and store its result in `contractors`.
            const contractors = await contractorService.getPlatformContractors();
            // Study: Send a JSON response to the client.
            res.status(200).json({ success: true, message: "Contractors retrieved successfully.", data: { contractors } });
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

        // Study: Call `contractorService.getOrganizationContractors` and wait for it to finish and store its result in `contractors`.
        const contractors = await contractorService.getOrganizationContractors(
            // Study: Supply `user` to the surrounding statement.
            user.organizationId
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Contractors retrieved successfully."`.
            message: "Contractors retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `contractors` value under the same property name.
                contractors,
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

// Study: Export `getContractorById` as an async function that returns a promise.
export const getContractorById = async (
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
        // Study: Validate `req.params` with `contractorIdSchema` and obtain the parsed value and store the result as `params`.
        const params = contractorIdSchema.parse(req.params);
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Run the following branch when `user.systemRole === "SUPER_ADMIN"` is truthy.
        if (user.systemRole === "SUPER_ADMIN") {
            // Study: Call `contractorService.getPlatformContractorById` and wait for it to finish and store its result in `contractor`.
            const contractor = await contractorService.getPlatformContractorById(params.id);
            // Study: Send a JSON response to the client.
            res.status(200).json({ success: true, message: "Contractor retrieved successfully.", data: { contractor } });
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

        // Study: Call `contractorService.getContractorById` and wait for it to finish and store its result in `contractor`.
        const contractor = await contractorService.getContractorById(
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
            // Study: Set `message` to `"Contractor retrieved successfully."`.
            message: "Contractor retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `contractor` value under the same property name.
                contractor,
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

// Study: Export `updateContractor` as an async function that returns a promise.
export const updateContractor = async (
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
        // Study: Validate `req.params` with `contractorIdSchema` and obtain the parsed value and store the result as `params`.
        const params = contractorIdSchema.parse(req.params);
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

        // Study: Validate `{ ...req.body, ...(req.file ? { profileImageUrl: '/uploads/contractors/${user.organ…` with `updateContractorSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = updateContractorSchema.parse({
            // Study: Expand the values from `req.body` into the surrounding collection.
            ...req.body,
            // Study: Expand the values from `(req.file ? { profileImageUrl: '/uploads/contractors/${user.organizationId}/${req.f…` into the surrounding collection.
            ...(req.file ? { profileImageUrl: `/uploads/contractors/${user.organizationId}/${req.file.filename}` } : {}),
        // Study: Close the object literal.
        });

        // Study: Call `contractorService.updateContractor` and wait for it to finish and store its result in `contractor`.
        const contractor = await contractorService.updateContractor(
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
            // Study: Set `message` to `"Contractor updated successfully."`.
            message: "Contractor updated successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `contractor` value under the same property name.
                contractor,
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
