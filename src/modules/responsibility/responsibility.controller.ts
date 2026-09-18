import { Request, Response, NextFunction } from "express";

import * as responsibilityService from "./responsibility.service";

export const getResponsibilities = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const responsibilities = await responsibilityService.getResponsibilities();

        res.status(200).json({
            success: true,
            data: {
                responsibilities,
            },
        });
    } catch (error) {
        next(error);
    }
};
