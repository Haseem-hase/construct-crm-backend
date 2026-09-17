import { Request, Response, NextFunction } from "express";
import * as professionService from "./profession.service";

export const getProfessions = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const professions = await professionService.getProfessions();

        res.status(200).json({
            success: true,
            data: {
                professions,
            },
        });
    } catch (error) {
        next(error);
    }
};
