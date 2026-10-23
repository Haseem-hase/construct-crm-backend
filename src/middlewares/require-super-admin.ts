import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../errors/ForbiddenError";

/** Restricts platform-wide operations to the system Super Admin role. */
export const requireSuperAdmin = (
    req: Request,
    _res: Response,
    next: NextFunction
) => {
    if (req.user?.systemRole !== "SUPER_ADMIN") {
        return next(new ForbiddenError("Only Super Admins can manage organizations."));
    }

    next();
};
