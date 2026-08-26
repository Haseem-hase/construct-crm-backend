import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/ForbiddenError";

export const authorize = (...roles: string[]) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        if (!roles.includes(req.user!.role.name)) {
            throw new ForbiddenError(
                "You are not authorized to perform this action."
            );
        }

        next();
    }
}
