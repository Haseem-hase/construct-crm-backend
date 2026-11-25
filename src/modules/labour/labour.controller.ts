// Study: This file is about workers and the kinds of work they do. Takes information sent by the screen, asks the backend to do the work, and sends back the result.
// Study: Bring in `{ Request, Response, NextFunction }` from `"express"` so this file can use it.
import { Request, Response, NextFunction } from "express";

// Study: Bring in `* as labourService` from `"./labour.service"` so this file can use it.
import * as labourService from "./labour.service";

// Study: Bring in `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"` so this file can use it.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Bring in `{ ForbiddenError }` from `"../../errors/ForbiddenError"` so this file can use it.
import { ForbiddenError } from "../../errors/ForbiddenError";

// Study: Bring in `{ createLabourSchema, updateLabourSchema, labourIdSchema, }` from `"./labour.validation"` so this file can use it.
import {
    // Study: Make `createLabourSchema` from the other file available here.
    createLabourSchema,
    // Study: Make `updateLabourSchema` from the other file available here.
    updateLabourSchema,
    // Study: Make `labourIdSchema` from the other file available here.
    labourIdSchema,
// Study: Finish this group and continue the surrounding step.
} from "./labour.validation";

// Create Labour
// Study: Make `createLabour` available to other files. Its result arrives after its work finishes.
export const createLabour = async (
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

        // Study: Check `{ ...req.body, ...(req.file ? { profileImageUrl: '/uploads/labour/${user.organizati…` using the rule `createLabourSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = createLabourSchema.parse({
            // Study: Expand the values from `req.body` into the surrounding collection.
            ...req.body,
            // Study: Expand the values from `(req.file ? { profileImageUrl: '/uploads/labour/${user.organizationId}/${req.file.f…` into the surrounding collection.
            ...(req.file ? { profileImageUrl: `/uploads/labour/${user.organizationId}/${req.file.filename}` } : {}),
        // Study: End this group of values.
        });

        // Study: Call `labourService.createLabour` and wait for it to finish and store its result in `labour`.
        const labour = await labourService.createLabour(
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
            // Study: Set `message` to `"Labour created successfully."`.
            message: "Labour created successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `labour` into the new group under the same name.
                labour,
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

// Get Organization Labours
// Study: Make `getOrganizationLabours` available to other files. Its result arrives after its work finishes.
export const getOrganizationLabours = async (
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
            // Study: Call `labourService.getPlatformLabours` and wait for it to finish and store its result in `labours`.
            const labours = await labourService.getPlatformLabours();
            // Study: Send named information back to the screen as JSON.
            res.status(200).json({ success: true, message: "Labours retrieved successfully.", data: { labours } });
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

        // Study: Call `labourService.getOrganizationLabours` and wait for it to finish and store its result in `labours`.
        const labours = await labourService.getOrganizationLabours(
            // Study: Supply `user` to the surrounding statement.
            user.organizationId
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Labours retrieved successfully."`.
            message: "Labours retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `labours` into the new group under the same name.
                labours,
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

// Get Labour By ID
// Study: Make `getLabourById` available to other files. Its result arrives after its work finishes.
export const getLabourById = async (
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
        // Study: Check `req.params` using the rule `labourIdSchema` and obtain the parsed value and store the result as `params`.
        const params = labourIdSchema.parse(req.params);
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;

        // Study: Do the next step if this check passes: `user.systemRole === "SUPER_ADMIN"`.
        if (user.systemRole === "SUPER_ADMIN") {
            // Study: Call `labourService.getPlatformLabourById` and wait for it to finish and store its result in `labour`.
            const labour = await labourService.getPlatformLabourById(params.id);
            // Study: Send named information back to the screen as JSON.
            res.status(200).json({ success: true, message: "Labour retrieved successfully.", data: { labour } });
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

        // Study: Call `labourService.getLabourById` and wait for it to finish and store its result in `labour`.
        const labour = await labourService.getLabourById(
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
            // Study: Set `message` to `"Labour retrieved successfully."`.
            message: "Labour retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `labour` into the new group under the same name.
                labour,
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

// Update Labour
// Study: Make `updateLabour` available to other files. Its result arrives after its work finishes.
export const updateLabour = async (
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
        // Study: Check `req.params` using the rule `labourIdSchema` and obtain the parsed value and store the result as `params`.
        const params = labourIdSchema.parse(req.params);
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

        // Study: Check `{ ...req.body, ...(req.file ? { profileImageUrl: '/uploads/labour/${user.organizati…` using the rule `updateLabourSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = updateLabourSchema.parse({
            // Study: Expand the values from `req.body` into the surrounding collection.
            ...req.body,
            // Study: Expand the values from `(req.file ? { profileImageUrl: '/uploads/labour/${user.organizationId}/${req.file.f…` into the surrounding collection.
            ...(req.file ? { profileImageUrl: `/uploads/labour/${user.organizationId}/${req.file.filename}` } : {}),
        // Study: End this group of values.
        });

        // Study: Call `labourService.updateLabour` and wait for it to finish and store its result in `labour`.
        const labour = await labourService.updateLabour(
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
            // Study: Set `message` to `"Labour updated successfully."`.
            message: "Labour updated successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `labour` into the new group under the same name.
                labour,
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
