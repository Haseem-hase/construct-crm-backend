import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";

export const registerCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await authService.registerCustomer(req.body);

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};