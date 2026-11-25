// Study: This file is about the details the CRM keeps about contractors. Takes information sent by the screen, asks the backend to do the work, and sends back the result.
// Study: Bring in `{ Request, Response, NextFunction }` from `"express"` so this file can use it.
import { Request, Response, NextFunction } from "express";

// Study: Bring in `* as contractorService` from `"./contractor.service"` so this file can use it.
import * as contractorService from "./contractor.service";

// Study: Bring in `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"` so this file can use it.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Bring in `{ ForbiddenError }` from `"../../errors/ForbiddenError"` so this file can use it.
import { ForbiddenError } from "../../errors/ForbiddenError";

// Study: Bring in `{ createContractorSchema, updateContractorSchema, contractorIdSchema, }` from `"./contractor.validation"` so this file can use it.
import {
    // Study: Make `createContractorSchema` from the other file available here.
    createContractorSchema,
    // Study: Make `updateContractorSchema` from the other file available here.
    updateContractorSchema,
    // Study: Make `contractorIdSchema` from the other file available here.
    contractorIdSchema,
// Study: Finish this group and continue the surrounding step.
} from "./contractor.validation";

// Study: Make `createContractor` available to other files. Its result arrives after its work finishes.
export const createContractor = async (
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

        // Study: Check `{ ...req.body, ...(req.file ? { profileImageUrl: '/uploads/contractors/${user.organ…` using the rule `createContractorSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = createContractorSchema.parse({
            // Study: Expand the values from `req.body` into the surrounding collection.
            ...req.body,
            // Study: Expand the values from `(req.file ? { profileImageUrl: '/uploads/contractors/${user.organizationId}/${req.f…` into the surrounding collection.
            ...(req.file ? { profileImageUrl: `/uploads/contractors/${user.organizationId}/${req.file.filename}` } : {}),
        // Study: End this group of values.
        });

        // Study: Call `contractorService.createContractor` and wait for it to finish and store its result in `contractor`.
        const contractor = await contractorService.createContractor(
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
            // Study: Set `message` to `"Contractor created successfully."`.
            message: "Contractor created successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `contractor` into the new group under the same name.
                contractor,
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

// Study: Make `getOrganizationContractors` available to other files. Its result arrives after its work finishes.
export const getOrganizationContractors = async (
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

        // Study: Do the next step if this check passes: `user.systemRole === "SUPER_ADMIN"`.
        if (user.systemRole === "SUPER_ADMIN") {
            // Study: Call `contractorService.getPlatformContractors` and wait for it to finish and store its result in `contractors`.
            const contractors = await contractorService.getPlatformContractors();
            // Study: Send named information back to the screen as JSON.
            res.status(200).json({ success: true, message: "Contractors retrieved successfully.", data: { contractors } });
            // Study: Exit the function here.
            return;
        // Study: End this group of steps.
        }
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

        // Study: Call `contractorService.getOrganizationContractors` and wait for it to finish and store its result in `contractors`.
        const contractors = await contractorService.getOrganizationContractors(
            // Study: Supply `user` to the surrounding statement.
            user.organizationId
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Contractors retrieved successfully."`.
            message: "Contractors retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `contractors` into the new group under the same name.
                contractors,
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

// Study: Make `getContractorById` available to other files. Its result arrives after its work finishes.
export const getContractorById = async (
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
        // Study: Check `req.params` using the rule `contractorIdSchema` and obtain the parsed value and store the result as `params`.
        const params = contractorIdSchema.parse(req.params);
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;

        // Study: Do the next step if this check passes: `user.systemRole === "SUPER_ADMIN"`.
        if (user.systemRole === "SUPER_ADMIN") {
            // Study: Call `contractorService.getPlatformContractorById` and wait for it to finish and store its result in `contractor`.
            const contractor = await contractorService.getPlatformContractorById(params.id);
            // Study: Send named information back to the screen as JSON.
            res.status(200).json({ success: true, message: "Contractor retrieved successfully.", data: { contractor } });
            // Study: Exit the function here.
            return;
        // Study: End this group of steps.
        }
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

        // Study: Call `contractorService.getContractorById` and wait for it to finish and store its result in `contractor`.
        const contractor = await contractorService.getContractorById(
            // Study: Supply `params` to the surrounding statement.
            params.id,
            // Study: Supply `user` to the surrounding statement.
            user.organizationId
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Contractor retrieved successfully."`.
            message: "Contractor retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `contractor` into the new group under the same name.
                contractor,
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

// Study: Make `updateContractor` available to other files. Its result arrives after its work finishes.
export const updateContractor = async (
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
        // Study: Check `req.params` using the rule `contractorIdSchema` and obtain the parsed value and store the result as `params`.
        const params = contractorIdSchema.parse(req.params);
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

        // Study: Check `{ ...req.body, ...(req.file ? { profileImageUrl: '/uploads/contractors/${user.organ…` using the rule `updateContractorSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = updateContractorSchema.parse({
            // Study: Expand the values from `req.body` into the surrounding collection.
            ...req.body,
            // Study: Expand the values from `(req.file ? { profileImageUrl: '/uploads/contractors/${user.organizationId}/${req.f…` into the surrounding collection.
            ...(req.file ? { profileImageUrl: `/uploads/contractors/${user.organizationId}/${req.file.filename}` } : {}),
        // Study: End this group of values.
        });

        // Study: Call `contractorService.updateContractor` and wait for it to finish and store its result in `contractor`.
        const contractor = await contractorService.updateContractor(
            // Study: Supply `params` to the surrounding statement.
            params.id,
            // Study: Supply `user` to the surrounding statement.
            user.organizationId,
            // Study: Supply `validatedData` to the surrounding statement.
            validatedData
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Contractor updated successfully."`.
            message: "Contractor updated successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `contractor` into the new group under the same name.
                contractor,
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
