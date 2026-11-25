// Study: Restrict a route to users with the system-level super-admin role.
// Study: Import `{ NextFunction, Request, Response }` from `"express"`.
import { NextFunction, Request, Response } from "express";
// Study: Import `{ ForbiddenError }` from `"../errors/ForbiddenError"`.
import { ForbiddenError } from "../errors/ForbiddenError";

/** Restricts platform-wide operations to the system Super Admin role. */
// Study: Export `requireSuperAdmin` as a reusable function.
export const requireSuperAdmin = (
    // Study: Accept `req` with type `Request`.
    req: Request,
    // Study: Accept `_res` with type `Response`.
    _res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run the following branch when `req.user?.systemRole !== "SUPER_ADMIN"` is truthy.
    if (req.user?.systemRole !== "SUPER_ADMIN") {
        // Study: Return `next(new ForbiddenError("Only Super Admins can manage organizations."))` to the caller.
        return next(new ForbiddenError("Only Super Admins can manage organizations."));
    // Study: Close the code block.
    }

    // Study: Continue to the next Express middleware or handler.
    next();
// Study: Close the code block.
};
