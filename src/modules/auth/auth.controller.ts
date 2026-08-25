import { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service";
import { success } from "zod";

//register
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

//login
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try{
        const result = await authService.login(req.body);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

//get me
export const getMe = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await authService.getMe(req.user!);

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
}

//post refresh token logic
export const refreshAccessToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await authService.refreshAccessToken(
            req.body.refreshToken
        );

        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
};

//logout
export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await authService.logout(
            req.body.refreshToken
        );

        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};