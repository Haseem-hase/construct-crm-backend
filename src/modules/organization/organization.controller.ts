import { Request, Response, NextFunction } from "express";

import * as organizationService from "./organization.service";

export const registerOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result =
            await organizationService.registerOrganization(
                req.body
            );

        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};