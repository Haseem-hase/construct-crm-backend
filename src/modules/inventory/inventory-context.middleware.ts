// Study: Prepare or check HTTP request context for inventory assets, warehouse stock, requests, returns, and condition reports.
// Study: Import `{ NextFunction, Request, Response }` from `"express"`.
import { NextFunction, Request, Response } from "express";
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";
// Study: Import `{ ForbiddenError }` from `"../../errors/ForbiddenError"`.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Import `{ BadRequestError }` from `"../../errors/BadRequestError"`.
import { BadRequestError } from "../../errors/BadRequestError";

/** Establishes a single trusted tenant context for every inventory request. */
// Study: Export `requireInventoryOrganization` as an async function that returns a promise.
export const requireInventoryOrganization = async (
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
        // Study: Set `user` to `req.user!`.
        const user = req.user!;
        // Study: Call `req.header` and store the result as `requestedOrganizationId`.
        const requestedOrganizationId = req.header("x-organization-id");

        // Study: Run the following branch when `user.systemRole === "SUPER_ADMIN"` is truthy.
        if (user.systemRole === "SUPER_ADMIN") {
            // Study: Run the following branch when `!requestedOrganizationId` is truthy.
            if (!requestedOrganizationId) {
                // Study: Stop this execution path by throwing `new BadRequestError("Super Admin inventory access requires x-organization-id.")`.
                throw new BadRequestError("Super Admin inventory access requires x-organization-id.");
            // Study: Close the code block.
            }
            // Study: Look up a single record using a unique key through `prisma.organization` and wait for it to finish and store its result in `organization`.
            const organization = await prisma.organization.findUnique({
                // Study: Set the conditions that database records must match using id.
                where: { id: requestedOrganizationId },
                // Study: Choose which fields Prisma returns.
                select: { id: true },
            // Study: Close the object literal.
            });
            // Study: Run the following branch when `!organization` is truthy and throw `new BadRequestError("Selected organization was not found.")`.
            if (!organization) throw new BadRequestError("Selected organization was not found.");
            // Study: Assign `organization.id` to `res.locals.inventoryOrganizationId`.
            res.locals.inventoryOrganizationId = organization.id;
            // Study: Continue to the next Express middleware or handler.
            next();
            // Study: Exit the function here.
            return;
        // Study: Close the code block.
        }

        // Study: Run the following branch when `!user.organizationId` is truthy.
        if (!user.organizationId) {
            // Study: Stop this execution path by throwing `new ForbiddenError("Inventory access requires an organization context.")`.
            throw new ForbiddenError("Inventory access requires an organization context.");
        // Study: Close the code block.
        }
        // Study: Run the following branch when `requestedOrganizationId && requestedOrganizationId !== user.organizationId` is truthy.
        if (requestedOrganizationId && requestedOrganizationId !== user.organizationId) {
            // Study: Stop this execution path by throwing `new ForbiddenError("You cannot access inventory outside your organization.")`.
            throw new ForbiddenError("You cannot access inventory outside your organization.");
        // Study: Close the code block.
        }
        // Study: Assign `user.organizationId` to `res.locals.inventoryOrganizationId`.
        res.locals.inventoryOrganizationId = user.organizationId;
        // Study: Continue to the next Express middleware or handler.
        next();
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `inventoryOrganizationId` as a reusable function.
export const inventoryOrganizationId = (res: Response): string => {
    // Study: Set `organizationId` to `res.locals.inventoryOrganizationId as string | undefined`.
    const organizationId = res.locals.inventoryOrganizationId as string | undefined;
    // Study: Run the following branch when `!organizationId` is truthy and throw `new ForbiddenError("Inventory organization context is missing.")`.
    if (!organizationId) throw new ForbiddenError("Inventory organization context is missing.");
    // Study: Return `organizationId` to the caller.
    return organizationId;
// Study: Close the code block.
};
