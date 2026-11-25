// Study: This file is about job roles in each company and the actions people in those roles may take. Takes information sent by the screen, asks the backend to do the work, and sends back the result.
// Study: Bring in `{ Request, Response, NextFunction }` from `"express"` so this file can use it.
import { Request, Response, NextFunction } from "express";

// Study: Bring in `{ createGlobalRoleService, getGlobalRolesService, getGlobalRoleService, updateGloba…` from `"./role.service"` so this file can use it.
import {
    // Study: Make `createGlobalRoleService` from the other file available here.
    createGlobalRoleService,
    // Study: Make `getGlobalRolesService` from the other file available here.
    getGlobalRolesService,
    // Study: Make `getGlobalRoleService` from the other file available here.
    getGlobalRoleService,
    // Study: Make `updateGlobalRoleService` from the other file available here.
    updateGlobalRoleService,
    // Study: Make `deleteGlobalRoleService` from the other file available here.
    deleteGlobalRoleService,
    // Study: Make `createOrganizationRoleService` from the other file available here.
    createOrganizationRoleService,
    // Study: Make `getOrganizationRolesService` from the other file available here.
    getOrganizationRolesService,
    // Study: Make `getOrganizationRoleService` from the other file available here.
    getOrganizationRoleService,
    // Study: Make `updateOrganizationRoleService` from the other file available here.
    updateOrganizationRoleService,
    // Study: Make `deleteOrganizationRoleService` from the other file available here.
    deleteOrganizationRoleService,
// Study: Finish this group and continue the surrounding step.
} from "./role.service";

// ==========================================
// GLOBAL ROLE CONTROLLERS
// ==========================================

// Study: Make `createGlobalRoleController` available to other files. Its result arrives after its work finishes.
export const createGlobalRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Call `createGlobalRoleService` and wait for it to finish and store its result in `role`.
        const role = await createGlobalRoleService(req.body);
        // Study: Give `res.status(201).json({ success: true, message: "Global role created successfully.",…` back to the code that asked for it.
        return res.status(201).json({ success: true, message: "Global role created successfully.", data: { role } });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `getGlobalRolesController` available to other files. Its result arrives after its work finishes.
export const getGlobalRolesController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Call `getGlobalRolesService` and wait for it to finish and store its result in `roles`.
        const roles = await getGlobalRolesService();
        // Study: Give `res.status(200).json({ success: true, message: "Global roles retrieved successfully…` back to the code that asked for it.
        return res.status(200).json({ success: true, message: "Global roles retrieved successfully.", data: { roles } });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `getGlobalRoleController` available to other files. Its result arrives after its work finishes.
export const getGlobalRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Call `getGlobalRoleService` and wait for it to finish and store its result in `role`.
        const role = await getGlobalRoleService(req.params.id as string);
        // Study: Give `res.status(200).json({ success: true, message: "Global role retrieved successfully.…` back to the code that asked for it.
        return res.status(200).json({ success: true, message: "Global role retrieved successfully.", data: { role } });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `updateGlobalRoleController` available to other files. Its result arrives after its work finishes.
export const updateGlobalRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Call `updateGlobalRoleService` and wait for it to finish and store its result in `role`.
        const role = await updateGlobalRoleService(req.params.id as string, req.body);
        // Study: Give `res.status(200).json({ success: true, message: "Global role updated successfully.",…` back to the code that asked for it.
        return res.status(200).json({ success: true, message: "Global role updated successfully.", data: { role } });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `deleteGlobalRoleController` available to other files. Its result arrives after its work finishes.
export const deleteGlobalRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Call `deleteGlobalRoleService` and wait for it to finish and store its result in `role`.
        const role = await deleteGlobalRoleService(req.params.id as string);
        // Study: Give `res.status(200).json({ success: true, message: "Global role deleted successfully.",…` back to the code that asked for it.
        return res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Global role deleted successfully."`.
            message: "Global role deleted successfully.",
            // Study: Supply the values to write to the database.
            data: { role },
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

// ==========================================
// ORGANIZATION ROLE CONTROLLERS
// ==========================================

// Study: Make `createOrganizationRoleController` available to other files. Its result arrives after its work finishes.
export const createOrganizationRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Set `organizationId` to `req.user!.organizationId!`.
        const organizationId = req.user!.organizationId!;
        // Study: Call `createOrganizationRoleService` and wait for it to finish and store its result in `role`.
        const role = await createOrganizationRoleService(organizationId, req.body);
        // Study: Give `res.status(201).json({ success: true, message: "Organization role created successfu…` back to the code that asked for it.
        return res.status(201).json({ success: true, message: "Organization role created successfully.", data: { role } });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `getOrganizationRolesController` available to other files. Its result arrives after its work finishes.
export const getOrganizationRolesController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Set `organizationId` to `req.user!.organizationId!`.
        const organizationId = req.user!.organizationId!;
        // Study: Call `getOrganizationRolesService` and wait for it to finish and store its result in `roles`.
        const roles = await getOrganizationRolesService(organizationId);
        // Study: Give `res.status(200).json({ success: true, message: "Organization roles retrieved succes…` back to the code that asked for it.
        return res.status(200).json({ success: true, message: "Organization roles retrieved successfully.", data: { roles } });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `getOrganizationRoleController` available to other files. Its result arrives after its work finishes.
export const getOrganizationRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Set `organizationId` to `req.user!.organizationId!`.
        const organizationId = req.user!.organizationId!;
        // Study: Call `getOrganizationRoleService` and wait for it to finish and store its result in `role`.
        const role = await getOrganizationRoleService(req.params.id as string, organizationId);
        // Study: Give `res.status(200).json({ success: true, message: "Organization role retrieved success…` back to the code that asked for it.
        return res.status(200).json({ success: true, message: "Organization role retrieved successfully.", data: { role } });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `updateOrganizationRoleController` available to other files. Its result arrives after its work finishes.
export const updateOrganizationRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Set `organizationId` to `req.user!.organizationId!`.
        const organizationId = req.user!.organizationId!;
        // Study: Call `updateOrganizationRoleService` and wait for it to finish and store its result in `role`.
        const role = await updateOrganizationRoleService(req.params.id as string, organizationId, req.body);
        // Study: Give `res.status(200).json({ success: true, message: "Organization role updated successfu…` back to the code that asked for it.
        return res.status(200).json({ success: true, message: "Organization role updated successfully.", data: { role } });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `deleteOrganizationRoleController` available to other files. Its result arrives after its work finishes.
export const deleteOrganizationRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Set `organizationId` to `req.user!.organizationId!`.
        const organizationId = req.user!.organizationId!;
        // Study: Call `deleteOrganizationRoleService` and wait for it to finish and store its result in `role`.
        const role = await deleteOrganizationRoleService(req.params.id as string, organizationId);
        // Study: Give `res.status(200).json({ success: true, message: "Organization role deleted successfu…` back to the code that asked for it.
        return res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Organization role deleted successfully."`.
            message: "Organization role deleted successfully.",
            // Study: Supply the values to write to the database.
            data: { role },
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