import { Request, Response, NextFunction } from "express";
import * as projectService from "./project.service";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";

export const createProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;
        const result = await projectService.createProject(req.body, user);
        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getOrganizationProjects = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;
        const result = await projectService.getOrganizationProjects(user);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getProjectById = async (
    req: Request<{ projectId: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;
        const result = await projectService.getProjectById(req.params.projectId, user);
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const updateProject = async (
    req: Request<{ projectId: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;
        const result = await projectService.updateProject(
            req.params.projectId,
            req.body,
            user
        );
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteProject = async (
    req: Request<{ projectId: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;
        const result = await projectService.deleteProject(
            req.params.projectId,
            user
        );
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
