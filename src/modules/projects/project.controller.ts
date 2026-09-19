import { Request, Response, NextFunction } from "express";
import * as projectService from "./project.service";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
import { createProjectSchema, updateProjectSchema, projectIdSchema } from "./project.validation";

export const createProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;
        const validatedData = createProjectSchema.parse(req.body);
        const result = await projectService.createProject(validatedData, user);
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
        const validatedParams = projectIdSchema.parse(req.params);
        const result = await projectService.getProjectById(validatedParams.projectId, user);
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
        const validatedParams = projectIdSchema.parse(req.params);
        const validatedData = updateProjectSchema.parse(req.body);
        const result = await projectService.updateProject(
            validatedParams.projectId,
            validatedData,
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
        const validatedParams = projectIdSchema.parse(req.params);
        const result = await projectService.deleteProject(
            validatedParams.projectId,
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
