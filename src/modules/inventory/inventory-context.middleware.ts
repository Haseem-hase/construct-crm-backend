// Study: This file is about tools, equipment, and materials that warehouses store, issue, and take back. Runs a check or prepares information before the main work happens.
// Study: Bring in `{ NextFunction, Request, Response }` from `"express"` so this file can use it.
import { NextFunction, Request, Response } from "express";
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";
// Study: Bring in `{ ForbiddenError }` from `"../../errors/ForbiddenError"` so this file can use it.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Bring in `{ BadRequestError }` from `"../../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../../errors/BadRequestError";

/** Establishes a single trusted tenant context for every inventory request. */
// Study: Make `requireInventoryOrganization` available to other files. Its result arrives after its work finishes.
export const requireInventoryOrganization = async (
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
        // Study: Set `user` to `req.user!`.
        const user = req.user!;
        // Study: Call `req.header` and store the result as `requestedOrganizationId`.
        const requestedOrganizationId = req.header("x-organization-id");

        // Study: Do the next step if this check passes: `user.systemRole === "SUPER_ADMIN"`.
        if (user.systemRole === "SUPER_ADMIN") {
            // Study: Do the next step if there is no value for `requestedOrganizationId`.
            if (!requestedOrganizationId) {
                // Study: Stop here and report this problem: "Super Admin inventory access requires x-organization-id."
                throw new BadRequestError("Super Admin inventory access requires x-organization-id.");
            // Study: End this group of steps.
            }
            // Study: Look up a single record using a unique key through `prisma.organization` and wait for it to finish and store its result in `organization`.
            const organization = await prisma.organization.findUnique({
                // Study: Set the conditions that records must meet using id.
                where: { id: requestedOrganizationId },
                // Study: Choose which details the database gives back.
                select: { id: true },
            // Study: End this group of values.
            });
            // Study: Do the next step if there is no value for `organization` . If so, stop and report "Selected organization was not found."
            if (!organization) throw new BadRequestError("Selected organization was not found.");
            // Study: Assign `organization.id` to `res.locals.inventoryOrganizationId`.
            res.locals.inventoryOrganizationId = organization.id;
            // Study: Allow the request to move to its next check or action.
            next();
            // Study: Exit the function here.
            return;
        // Study: End this group of steps.
        }

        // Study: Do the next step if this check passes: `!user.organizationId`.
        if (!user.organizationId) {
            // Study: Stop here and report this problem: "Inventory access requires an organization context."
            throw new ForbiddenError("Inventory access requires an organization context.");
        // Study: End this group of steps.
        }
        // Study: Do the next step if this check passes: `requestedOrganizationId && requestedOrganizationId !== user.organizationId`.
        if (requestedOrganizationId && requestedOrganizationId !== user.organizationId) {
            // Study: Stop here and report this problem: "You cannot access inventory outside your organization."
            throw new ForbiddenError("You cannot access inventory outside your organization.");
        // Study: End this group of steps.
        }
        // Study: Assign `user.organizationId` to `res.locals.inventoryOrganizationId`.
        res.locals.inventoryOrganizationId = user.organizationId;
        // Study: Allow the request to move to its next check or action.
        next();
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Set up a reusable step named `inventoryOrganizationId`.
export const inventoryOrganizationId = (res: Response): string => {
    // Study: Set `organizationId` to `res.locals.inventoryOrganizationId as string | undefined`.
    const organizationId = res.locals.inventoryOrganizationId as string | undefined;
    // Study: Do the next step if there is no value for `organizationId` . If so, stop and report "Inventory organization context is missing."
    if (!organizationId) throw new ForbiddenError("Inventory organization context is missing.");
    // Study: Give `organizationId` back to the code that asked for it.
    return organizationId;
// Study: End this group of steps.
};
