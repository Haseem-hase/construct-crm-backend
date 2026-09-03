import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/ForbiddenError";

export const authorize = (...roles: string[]) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const user = req.user!;

        if (user.systemRole === "SUPER_ADMIN") {
            // SUPER_ADMIN has access to routes that allow SUPER_ADMIN explicitly
            if (roles.includes("SUPER_ADMIN") || roles.length === 0) {
                return next();
            }
        }

        const userRole = user.systemRole || user.organizationRole?.role.name;

        if (!userRole || !roles.includes(userRole)) {
            throw new ForbiddenError(
                "You are not authorized to perform this action."
            );
        }

        next();
    }
}
