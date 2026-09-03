import { Request, Response, NextFunction } from "express";

import {
    createGlobalRoleService,
    getGlobalRolesService,
    getGlobalRoleService,
    updateGlobalRoleService,
    deleteGlobalRoleService,
    createOrganizationRoleService,
    getOrganizationRolesService,
    getOrganizationRoleService,
    updateOrganizationRoleService,
    deleteOrganizationRoleService,
} from "./role.service";

// ==========================================
// GLOBAL ROLE CONTROLLERS
// ==========================================

export const createGlobalRoleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = await createGlobalRoleService(req.body);
        return res.status(201).json({ success: true, data: { role } });
    } catch (error) {
        next(error);
    }
};

export const getGlobalRolesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const roles = await getGlobalRolesService();
        return res.status(200).json({ success: true, data: { roles } });
    } catch (error) {
        next(error);
    }
};

export const getGlobalRoleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = await getGlobalRoleService(req.params.id as string);
        return res.status(200).json({ success: true, data: { role } });
    } catch (error) {
        next(error);
    }
};

export const updateGlobalRoleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = await updateGlobalRoleService(req.params.id as string, req.body);
        return res.status(200).json({ success: true, data: { role } });
    } catch (error) {
        next(error);
    }
};

export const deleteGlobalRoleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const role = await deleteGlobalRoleService(req.params.id as string);
        return res.status(200).json({
            success: true,
            message: "Global role deleted successfully.",
            data: { role },
        });
    } catch (error) {
        next(error);
    }
};

// ==========================================
// ORGANIZATION ROLE CONTROLLERS
// ==========================================

export const createOrganizationRoleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizationId = req.user!.organizationId!;
        const role = await createOrganizationRoleService(organizationId, req.body);
        return res.status(201).json({ success: true, data: { role } });
    } catch (error) {
        next(error);
    }
};

export const getOrganizationRolesController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizationId = req.user!.organizationId!;
        const roles = await getOrganizationRolesService(organizationId);
        return res.status(200).json({ success: true, data: { roles } });
    } catch (error) {
        next(error);
    }
};

export const getOrganizationRoleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizationId = req.user!.organizationId!;
        const role = await getOrganizationRoleService(req.params.id as string, organizationId);
        return res.status(200).json({ success: true, data: { role } });
    } catch (error) {
        next(error);
    }
};

export const updateOrganizationRoleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizationId = req.user!.organizationId!;
        const role = await updateOrganizationRoleService(req.params.id as string, organizationId, req.body);
        return res.status(200).json({ success: true, data: { role } });
    } catch (error) {
        next(error);
    }
};

export const deleteOrganizationRoleController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const organizationId = req.user!.organizationId!;
        const role = await deleteOrganizationRoleService(req.params.id as string, organizationId);
        return res.status(200).json({
            success: true,
            message: "Organization role deleted successfully.",
            data: { role },
        });
    } catch (error) {
        next(error);
    }
};