import { Request, Response, NextFunction } from "express";
import * as projectService from "./project.service";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
import { BadRequestError } from "../../errors/BadRequestError";
import { createProjectSchema, updateProjectSchema, projectGallerySchema, projectIdSchema } from "./project.validation";
import type { ProjectImageMutation } from "./project.types";

const projectSubmission = (req: Request) => {
    const { imageGallery: rawGallery, ...body } = req.body ?? {};
    if (rawGallery === undefined) {
        if (Array.isArray(req.files) && req.files.length) throw new BadRequestError("The project image list is missing.");
        return { body, images: undefined as ProjectImageMutation[] | undefined };
    }

    let galleryInput: unknown = rawGallery;
    if (typeof rawGallery === "string") {
        try { galleryInput = JSON.parse(rawGallery); }
        catch { throw new BadRequestError("The project image list is invalid."); }
    }

    const gallery = projectGallerySchema.parse(galleryInput);
    const uploadedFiles = Array.isArray(req.files) ? req.files as Express.Multer.File[] : [];
    const uploadEntries = gallery.filter((image) => image.source === "upload");
    if (uploadEntries.length !== uploadedFiles.length || uploadEntries.some(image => image.source === "upload" && image.uploadIndex >= uploadedFiles.length)) {
        throw new BadRequestError("The uploaded project images do not match the image list.");
    }

    const organizationId = req.user?.organizationId;
    const images: ProjectImageMutation[] = gallery.map((image) => {
        const details = { kind: image.kind, visitedAt: image.visitedAt === undefined ? undefined : image.visitedAt ? new Date(image.visitedAt) : null, siteStage: image.siteStage, areaSqFt: image.areaSqFt, notes: image.notes };
        if (image.source === "existing") return { ...details, id: image.id, isCover: image.isCover };
        if (image.source === "url") return { ...details, imageUrl: image.url, alt: image.alt, isCover: image.isCover };
        if (!organizationId) throw new BadRequestError("Project organization context is missing.");
        return {
            ...details,
            imageUrl: `/uploads/projects/${organizationId}/${uploadedFiles[image.uploadIndex].filename}`,
            alt: image.alt,
            isCover: image.isCover,
        };
    });

    return { body, images };
};

export const createProject = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;
        const submission = projectSubmission(req);
        if (submission.images?.some(image => image.id)) throw new BadRequestError("A new project cannot reference existing project images.");
        const cover = submission.images?.find(image => image.isCover);
        const validatedData = createProjectSchema.parse({ ...submission.body, ...(cover?.imageUrl ? { imageUrl: cover.imageUrl } : {}) });
        const result = await projectService.createProject(validatedData, user, submission.images);
        res.status(201).json({
            success: true,
            message: "Project created successfully.",
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
            message: "Projects retrieved successfully.",
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
            message: "Project retrieved successfully.",
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
        const submission = projectSubmission(req);
        const validatedData = submission.images !== undefined && Object.keys(submission.body).length === 0
            ? {}
            : updateProjectSchema.parse(submission.body);
        const result = await projectService.updateProject(
            validatedParams.projectId,
            validatedData,
            user,
            submission.images
        );
        res.status(200).json({
            success: true,
            message: "Project updated successfully.",
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
            message: "Project deleted successfully.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
