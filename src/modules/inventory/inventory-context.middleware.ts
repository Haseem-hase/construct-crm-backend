import { NextFunction, Request, Response } from "express";
import prisma from "../../lib/prisma";
import { ForbiddenError } from "../../errors/ForbiddenError";
import { BadRequestError } from "../../errors/BadRequestError";

/** Establishes a single trusted tenant context for every inventory request. */
export const requireInventoryOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user!;
        const requestedOrganizationId = req.header("x-organization-id");

        if (user.systemRole === "SUPER_ADMIN") {
            if (!requestedOrganizationId) {
                throw new BadRequestError("Super Admin inventory access requires x-organization-id.");
            }
            const organization = await prisma.organization.findUnique({
                where: { id: requestedOrganizationId },
                select: { id: true },
            });
            if (!organization) throw new BadRequestError("Selected organization was not found.");
            res.locals.inventoryOrganizationId = organization.id;
            next();
            return;
        }

        if (!user.organizationId) {
            throw new ForbiddenError("Inventory access requires an organization context.");
        }
        if (requestedOrganizationId && requestedOrganizationId !== user.organizationId) {
            throw new ForbiddenError("You cannot access inventory outside your organization.");
        }
        res.locals.inventoryOrganizationId = user.organizationId;
        next();
    } catch (error) {
        next(error);
    }
};

export const inventoryOrganizationId = (res: Response): string => {
    const organizationId = res.locals.inventoryOrganizationId as string | undefined;
    if (!organizationId) throw new ForbiddenError("Inventory organization context is missing.");
    return organizationId;
};
