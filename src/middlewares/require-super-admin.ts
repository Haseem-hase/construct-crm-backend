// Study: Restrict a route to users with the system-level super-admin role.
// Study: Bring in `{ NextFunction, Request, Response }` from `"express"` so this file can use it.
import { NextFunction, Request, Response } from "express";
// Study: Bring in `{ ForbiddenError }` from `"../errors/ForbiddenError"` so this file can use it.
import { ForbiddenError } from "../errors/ForbiddenError";

/** Restricts platform-wide operations to the system Super Admin role. */
// Study: Set up a reusable step named `requireSuperAdmin`.
export const requireSuperAdmin = (
    // Study: Read the information that came in with the request from the screen.
    req: Request,
    // Study: This step receives `_res`. `Response` describes what that information should look like.
    _res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Do the next step if this check passes: `req.user?.systemRole !== "SUPER_ADMIN"`.
    if (req.user?.systemRole !== "SUPER_ADMIN") {
        // Study: Give `next(new ForbiddenError("Only Super Admins can manage organizations."))` back to the code that asked for it.
        return next(new ForbiddenError("Only Super Admins can manage organizations."));
    // Study: End this group of steps.
    }

    // Study: Allow the request to move to its next check or action.
    next();
// Study: End this group of steps.
};
