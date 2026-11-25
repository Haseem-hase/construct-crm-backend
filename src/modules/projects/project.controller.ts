// Study: This file is about construction jobs, their site details, and their photos. Takes information sent by the screen, asks the backend to do the work, and sends back the result.
// Study: Bring in `{ Request, Response, NextFunction }` from `"express"` so this file can use it.
import { Request, Response, NextFunction } from "express";
// Study: Bring in `* as projectService` from `"./project.service"` so this file can use it.
import * as projectService from "./project.service";
// Study: Bring in `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"` so this file can use it.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Bring in `{ BadRequestError }` from `"../../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../../errors/BadRequestError";
// Study: Bring in `{ createProjectSchema, updateProjectSchema, projectGallerySchema, projectIdSchema }` from `"./project.validation"` so this file can use it.
import { createProjectSchema, updateProjectSchema, projectGallerySchema, projectIdSchema } from "./project.validation";
// Study: Bring in `type { ProjectImageMutation }` from `"./project.types"` so this file can use it.
import type { ProjectImageMutation } from "./project.types";

// Study: Set up a reusable step named `projectSubmission`.
const projectSubmission = (req: Request) => {
    // Study: Set `{ imageGallery: rawGallery, ...body }` to `req.body ?? {}`.
    const { imageGallery: rawGallery, ...body } = req.body ?? {};
    // Study: Do the next step if this check passes: `rawGallery === undefined`.
    if (rawGallery === undefined) {
        // Study: Do the next step if this check passes: `Array.isArray(req.files) && req.files.length` . If so, stop and report "The project image list is missing."
        if (Array.isArray(req.files) && req.files.length) throw new BadRequestError("The project image list is missing.");
        // Study: Give `{ body, images: undefined as ProjectImageMutation[] | undefined }` back to the code that asked for it.
        return { body, images: undefined as ProjectImageMutation[] | undefined };
    // Study: End this group of steps.
    }

    // Study: Set `galleryInput` to `rawGallery`.
    let galleryInput: unknown = rawGallery;
    // Study: Do the next step if this check passes: `typeof rawGallery === "string"`.
    if (typeof rawGallery === "string") {
        // Study: Try these steps. If one fails, go to the error-handling steps below.
        try { galleryInput = JSON.parse(rawGallery); }
        // Study: Handle a problem raised during the steps above.
        catch { throw new BadRequestError("The project image list is invalid."); }
    // Study: End this group of steps.
    }

    // Study: Check `galleryInput` using the rule `projectGallerySchema` and obtain the parsed value and store the result as `gallery`.
    const gallery = projectGallerySchema.parse(galleryInput);
    // Study: Set `uploadedFiles` to `Array.isArray(req.files) ? req.files as Express.Multer.File[] : []`.
    const uploadedFiles = Array.isArray(req.files) ? req.files as Express.Multer.File[] : [];
    // Study: Keep the items in `gallery` that satisfy the predicate and store the result as `uploadEntries`.
    const uploadEntries = gallery.filter((image) => image.source === "upload");
    // Study: Do the next step if this check passes: `uploadEntries.length !== uploadedFiles.length || uploadEntries.some(image => image.…`.
    if (uploadEntries.length !== uploadedFiles.length || uploadEntries.some(image => image.source === "upload" && image.uploadIndex >= uploadedFiles.length)) {
        // Study: Stop here and report this problem: "The uploaded project images do not match the image list."
        throw new BadRequestError("The uploaded project images do not match the image list.");
    // Study: End this group of steps.
    }

    // Study: Get the company ID from the signed-in account if the account is available.
    const organizationId = req.user?.organizationId;
    // Study: Transform each item in `gallery` and store the result as `images`.
    const images: ProjectImageMutation[] = gallery.map((image) => {
        // Study: Build the object `details` with the entries below.
        const details = { kind: image.kind, visitedAt: image.visitedAt === undefined ? undefined : image.visitedAt ? new Date(image.visitedAt) : null, siteStage: image.siteStage, areaSqFt: image.areaSqFt, notes: image.notes };
        // Study: Do the next step if this check passes: `image.source === "existing"` and exit the function.
        if (image.source === "existing") return { ...details, id: image.id, isCover: image.isCover };
        // Study: Do the next step if this check passes: `image.source === "url"` and exit the function.
        if (image.source === "url") return { ...details, imageUrl: image.url, alt: image.alt, isCover: image.isCover };
        // Study: Do the next step if there is no value for `organizationId` . If so, stop and report "Project organization context is missing."
        if (!organizationId) throw new BadRequestError("Project organization context is missing.");
        // Study: Give `{ ...details, imageUrl: '/uploads/projects/${organizationId}/${uploadedFiles[image.…` back to the code that asked for it.
        return {
            // Study: Expand the values from `details` into the surrounding collection.
            ...details,
            // Study: Build the text for `imageUrl` by inserting the embedded expression values.
            imageUrl: `/uploads/projects/${organizationId}/${uploadedFiles[image.uploadIndex].filename}`,
            // Study: Set `alt` to `image.alt`.
            alt: image.alt,
            // Study: Set `isCover` to `image.isCover`.
            isCover: image.isCover,
        // Study: End this group of values.
        };
    // Study: End this group of steps.
    });

    // Study: Give `{ body, images }` back to the code that asked for it.
    return { body, images };
// Study: End this group of steps.
};

// Study: Make `createProject` available to other files. Its result arrives after its work finishes.
export const createProject = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;
        // Study: Call `projectSubmission` and store the result as `submission`.
        const submission = projectSubmission(req);
        // Study: Do the next step if this check passes: `submission.images?.some(image => image.id)` . If so, stop and report "A new project cannot reference existing project images."
        if (submission.images?.some(image => image.id)) throw new BadRequestError("A new project cannot reference existing project images.");
        // Study: Find the first matching item in `submission.images` and store the result as `cover`.
        const cover = submission.images?.find(image => image.isCover);
        // Study: Check `{ ...submission.body, ...(cover?.imageUrl ? { imageUrl: cover.imageUrl } : {}) }` using the rule `createProjectSchema` and obtain the parsed value and store the result as `validatedData`.
        const validatedData = createProjectSchema.parse({ ...submission.body, ...(cover?.imageUrl ? { imageUrl: cover.imageUrl } : {}) });
        // Study: Call `projectService.createProject` and wait for it to finish and store its result in `result`.
        const result = await projectService.createProject(validatedData, user, submission.images);
        // Study: Send named information back to the screen as JSON.
        res.status(201).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Project created successfully."`.
            message: "Project created successfully.",
            // Study: Set `data` to `result`.
            data: result,
        // Study: End this group of values.
        });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `getOrganizationProjects` available to other files. Its result arrives after its work finishes.
export const getOrganizationProjects = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;
        // Study: Call `projectService.getOrganizationProjects` and wait for it to finish and store its result in `result`.
        const result = await projectService.getOrganizationProjects(user);
        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Projects retrieved successfully."`.
            message: "Projects retrieved successfully.",
            // Study: Set `data` to `result`.
            data: result,
        // Study: End this group of values.
        });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `getProjectById` available to other files. Its result arrives after its work finishes.
export const getProjectById = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<{ projectId: string }>,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;
        // Study: Check `req.params` using the rule `projectIdSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdSchema.parse(req.params);
        // Study: Call `projectService.getProjectById` and wait for it to finish and store its result in `result`.
        const result = await projectService.getProjectById(validatedParams.projectId, user);
        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Project retrieved successfully."`.
            message: "Project retrieved successfully.",
            // Study: Set `data` to `result`.
            data: result,
        // Study: End this group of values.
        });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `updateProject` available to other files. Its result arrives after its work finishes.
export const updateProject = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<{ projectId: string }>,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;
        // Study: Check `req.params` using the rule `projectIdSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdSchema.parse(req.params);
        // Study: Call `projectSubmission` and store the result as `submission`.
        const submission = projectSubmission(req);
        // Study: Set `validatedData` to `submission.images !== undefined && Object.keys(submission.body).length === 0 ? {} :…`.
        const validatedData = submission.images !== undefined && Object.keys(submission.body).length === 0
            // Study: Use this value if the check above passes.
            ? {}
            // Study: Use this value if the check above fails.
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
        // Study: End the list of information being sent to this step.
        );
        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Project updated successfully."`.
            message: "Project updated successfully.",
            // Study: Set `data` to `result`.
            data: result,
        // Study: End this group of values.
        });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `deleteProject` available to other files. Its result arrives after its work finishes.
export const deleteProject = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<{ projectId: string }>,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;
        // Study: Check `req.params` using the rule `projectIdSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdSchema.parse(req.params);
        // Study: Call `projectService.deleteProject` and wait for it to finish and store its result in `result`.
        const result = await projectService.deleteProject(
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectId,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: End the list of information being sent to this step.
        );
        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Project deleted successfully."`.
            message: "Project deleted successfully.",
            // Study: Set `data` to `result`.
            data: result,
        // Study: End this group of values.
        });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};
