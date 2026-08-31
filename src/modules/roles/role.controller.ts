import { Request, Response, NextFunction } from "express";

import {
    createRoleService,
    getRolesService,
    getRoleService,
    updateRoleService,
    deleteRoleService,
} from "./role.service";


/**
 * Create Role
 */
export const createRoleController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const organizationId = req.user!.organizationId!;

        const role = await createRoleService(
            organizationId,
            req.body
        );

        return res.status(201).json({
            success: true,
            data: {
                role,
            },
        });

    } catch (error) {
        next(error);
    }
};


/**
 * Get all organization roles
 */
export const getRolesController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const organizationId = req.user!.organizationId!;

        const roles = await getRolesService(
            organizationId
        );

        return res.status(200).json({
            success: true,
            data: {
                roles,
            },
        });

    } catch (error) {
        next(error);
    }
};


/**
 * Get a single role
 */
export const getRoleController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const organizationId = req.user!.organizationId!;

        const role = await getRoleService(
            req.params.id as string,
            organizationId
        );

        return res.status(200).json({
            success: true,
            data: {
                role,
            },
        });

    } catch (error) {
        next(error);
    }
};


/**
 * Update Role
 */
export const updateRoleController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const organizationId = req.user!.organizationId!;

        const role = await updateRoleService(
            req.params.id as string,
            organizationId,
            req.body
        );

        return res.status(200).json({
            success: true,
            data: {
                role,
            },
        });

    } catch (error) {
        next(error);
    }
};


/**
 * Delete Role
 */
export const deleteRoleController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const organizationId = req.user!.organizationId!;

        const role = await deleteRoleService(
            req.params.id as string,
            organizationId
        );

        return res.status(200).json({
            success: true,
            message: "Role deleted successfully.",
            data: {
                role,
            },
        });

    } catch (error) {
        next(error);
    }
};