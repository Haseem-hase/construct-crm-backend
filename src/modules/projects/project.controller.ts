// Study: Translate HTTP requests into service calls and send HTTP responses for construction projects, their site details, and image galleries.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";
// Study: Import `* as projectService` from `"./project.service"`.
import * as projectService from "./project.service";
// Study: Import `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"`.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Import `{ BadRequestError }` from `"../../errors/BadRequestError"`.
import { BadRequestError } from "../../errors/BadRequestError";
// Study: Import `{ createProjectSchema, updateProjectSchema, projectGallerySchema, projectIdSchema }` from `"./project.validation"`.
import { createProjectSchema, updateProjectSchema, projectGallerySchema, projectIdSchema } from "./project.validation";
// Study: Import `type { ProjectImageMutation }` from `"./project.types"`.
import type { ProjectImageMutation } from "./project.types";

// Study: Define `projectSubmission` as a reusable function.
const projectSubmission = (req: Request) => {
    // Study: Set `{ imageGallery: rawGallery, ...body }` to `req.body ?? {}`.
    const { imageGallery: rawGallery, ...body } = req.body ?? {};
    // Study: Run the following branch when `rawGallery === undefined` is truthy.
    if (rawGallery === undefined) {
        // Study: Run the following branch when `Array.isArray(req.files) && req.files.length` is truthy and throw `new BadRequestError("The project image list is missing.")`.
        if (Array.isArray(req.files) && req.files.length) throw new BadRequestError("The project image list is missing.");
        // Study: Return `{ body, images: undefined as ProjectImageMutation[] | undefined }` to the caller.
        return { body, images: undefined as ProjectImageMutation[] | undefined };
    // Study: Close the code block.
    }

    // Study: Set `galleryInput` to `rawGallery`.
    let galleryInput: unknown = rawGallery;
    // Study: Run the following branch when `typeof rawGallery === "string"` is truthy.
    if (typeof rawGallery === "string") {
        // Study: Run this block and handle failures in the associated catch block.
        try { galleryInput = JSON.parse(rawGallery); }
        // Study: Handle an exception from the try block.
        catch { throw new BadRequestError("The project image list is invalid."); }
    // Study: Close the code block.
    }

    // Study: Validate `galleryInput` with `projectGallerySchema` and obtain the parsed value and store the result as `gallery`.
    const gallery = projectGallerySchema.parse(galleryInput);
    // Study: Set `uploadedFiles` to `Array.isArray(req.files) ? req.files as Express.Multer.File[] : []`.
    const uploadedFiles = Array.isArray(req.files) ? req.files as Express.Multer.File[] : [];
    // Study: Keep the items in `gallery` that satisfy the predicate and store the result as `uploadEntries`.
    const uploadEntries = gallery.filter((image) => image.source === "upload");
    // Study: Run the following branch when `uploadEntries.length !== uploadedFiles.length || uploadEntries.some(image => image.…` is truthy.
    if (uploadEntries.length !== uploadedFiles.length || uploadEntries.some(image => image.source === "upload" && image.uploadIndex >= uploadedFiles.length)) {
        // Study: Stop this execution path by throwing `new BadRequestError("The uploaded project images do not match the image list.")`.
        throw new BadRequestError("The uploaded project images do not match the image list.");
    // Study: Close the code block.
    }

    // Study: Set `organizationId` to `req.user?.organizationId`.
    const organizationId = req.user?.organizationId;
    // Study: Transform each item in `gallery` and store the result as `images`.
    const images: ProjectImageMutation[] = gallery.map((image) => {
        // Study: Build the object `details` with the entries below.
        const details = { kind: image.kind, visitedAt: image.visitedAt === undefined ? undefined : image.visitedAt ? new Date(image.visitedAt) : null, siteStage: image.siteStage, areaSqFt: image.areaSqFt, notes: image.notes };
        // Study: Run the following branch when `image.source === "existing"` is truthy and exit the function.
        if (image.source === "existing") return { ...details, id: image.id, isCover: image.isCover };
        // Study: Run the following branch when `image.source === "url"` is truthy and exit the function.
        if (image.source === "url") return { ...details, imageUrl: image.url, alt: image.alt, isCover: image.isCover };
        // Study: Run the following branch when `!organizationId` is truthy and throw `new BadRequestError("Project organization context is missing.")`.
        if (!organizationId) throw new BadRequestError("Project organization context is missing.");
        // Study: Return `{ ...details, imageUrl: '/uploads/projects/${organizationId}/${uploadedFiles[image.…` to the caller.
        return {
            // Study: Expand the values from `details` into the surrounding collection.
            ...details,
            // Study: Build the text for `imageUrl` by inserting the embedded expression values.
            imageUrl: `/uploads/projects/${organizationId}/${uploadedFiles[image.uploadIndex].filename}`,
            // Study: Set `alt` to `image.alt`.
            alt: image.alt,
            // Study: Set `isCover` to `image.isCover`.
            isCover: image.isCover,
        // Study: Close the object literal.
        };
    // Study: Close the code block.
    });

    // Study: Return `{ body, images }` to the caller.
    return { body, images };
// Study: Close the code block.
};

// Study: Export `createProject` as an async function that returns a promise.
export const createProject = async (
    // Study: Accept `req` with type `Request`.
    req: Request,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;
        // Study: Call `projectSubmission` and store the result as `submission`.
        const submission = projectSubmission(req);
        // Study: Run the following branch when `submission.images?.some(image => image.id)` is truthy and throw `new BadRequestError("A new project cannot reference existing project images.")`.
        if (submission.images?.some(image => image.id)) throw new BadRequestError("A new project cannot reference existing project images.");
        // Study: Find the first matching item in `submission.images` and store the result as `cover`.
        const cover = submission.images?.find(image => image.isCover);
        // Study: Validate `{ ...submission.body, ...(cover?.imageUrl ? { imageUrl: cover.imageUrl } : {}) }` with `createProjectSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = createProjectSchema.parse({ ...submission.body, ...(cover?.imageUrl ? { imageUrl: cover.imageUrl } : {}) });
        // Study: Call `projectService.createProject` and wait for it to finish and store its result in `result`.
        const result = await projectService.createProject(validatedData, user, submission.images);
        // Study: Send a JSON response to the client.
        res.status(201).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Project created successfully."`.
            message: "Project created successfully.",
            // Study: Set `data` to `result`.
            data: result,
        // Study: Close the object literal.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `getOrganizationProjects` as an async function that returns a promise.
export const getOrganizationProjects = async (
    // Study: Accept `req` with type `Request`.
    req: Request,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;
        // Study: Call `projectService.getOrganizationProjects` and wait for it to finish and store its result in `result`.
        const result = await projectService.getOrganizationProjects(user);
        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Projects retrieved successfully."`.
            message: "Projects retrieved successfully.",
            // Study: Set `data` to `result`.
            data: result,
        // Study: Close the object literal.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `getProjectById` as an async function that returns a promise.
export const getProjectById = async (
    // Study: Accept `req` with type `Request<{ projectId: string }>`.
    req: Request<{ projectId: string }>,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;
        // Study: Validate `req.params` with `projectIdSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdSchema.parse(req.params);
        // Study: Call `projectService.getProjectById` and wait for it to finish and store its result in `result`.
        const result = await projectService.getProjectById(validatedParams.projectId, user);
        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Project retrieved successfully."`.
            message: "Project retrieved successfully.",
            // Study: Set `data` to `result`.
            data: result,
        // Study: Close the object literal.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `updateProject` as an async function that returns a promise.
export const updateProject = async (
    // Study: Accept `req` with type `Request<{ projectId: string }>`.
    req: Request<{ projectId: string }>,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;
        // Study: Validate `req.params` with `projectIdSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdSchema.parse(req.params);
        // Study: Call `projectSubmission` and store the result as `submission`.
        const submission = projectSubmission(req);
        // Study: Set `validatedData` to `submission.images !== undefined && Object.keys(submission.body).length === 0 ? {} :…`.
        const validatedData = submission.images !== undefined && Object.keys(submission.body).length === 0
            // Study: Use this value when the preceding condition is truthy.
            ? {}
            // Study: Use this value when the preceding condition is falsy.
            : updateProjectSchema.parse(submission.body);
        // Study: Call `projectService.updateProject` and wait for it to finish and store its result in `result`.
        const result = await projectService.updateProject(
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectId,
            // Study: Supply `validatedData` to the surrounding statement.
            validatedData,
            // Study: Supply `user` to the surrounding statement.
            user,
            // Study: Supply `submission` to the surrounding statement.
            submission.images
        // Study: Close the call arguments.
        );
        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Project updated successfully."`.
            message: "Project updated successfully.",
            // Study: Set `data` to `result`.
            data: result,
        // Study: Close the object literal.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `deleteProject` as an async function that returns a promise.
export const deleteProject = async (
    // Study: Accept `req` with type `Request<{ projectId: string }>`.
    req: Request<{ projectId: string }>,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;
        // Study: Validate `req.params` with `projectIdSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdSchema.parse(req.params);
        // Study: Call `projectService.deleteProject` and wait for it to finish and store its result in `result`.
        const result = await projectService.deleteProject(
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectId,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );
        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Project deleted successfully."`.
            message: "Project deleted successfully.",
            // Study: Set `data` to `result`.
            data: result,
        // Study: Close the object literal.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};
