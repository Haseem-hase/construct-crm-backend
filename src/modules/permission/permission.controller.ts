import { Request, Response, NextFunction } from "express";
import { getAllPermissionsService } from "./permission.service";

export const getPermissionsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const permissions = await getAllPermissionsService();
        return res.status(200).json({ success: true, data: { permissions } });
    } catch (error) {
        next(error);
    }
};
