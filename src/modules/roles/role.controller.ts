// Study: Translate HTTP requests into service calls and send HTTP responses for role templates, organization roles, and permission assignments.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";

// Study: Import `{ createGlobalRoleService, getGlobalRolesService, getGlobalRoleService, updateGloba…` from `"./role.service"`.
import {
    // Study: Bring `createGlobalRoleService` into scope from the imported module.
    createGlobalRoleService,
    // Study: Bring `getGlobalRolesService` into scope from the imported module.
    getGlobalRolesService,
    // Study: Bring `getGlobalRoleService` into scope from the imported module.
    getGlobalRoleService,
    // Study: Bring `updateGlobalRoleService` into scope from the imported module.
    updateGlobalRoleService,
    // Study: Bring `deleteGlobalRoleService` into scope from the imported module.
    deleteGlobalRoleService,
    // Study: Bring `createOrganizationRoleService` into scope from the imported module.
    createOrganizationRoleService,
    // Study: Bring `getOrganizationRolesService` into scope from the imported module.
    getOrganizationRolesService,
    // Study: Bring `getOrganizationRoleService` into scope from the imported module.
    getOrganizationRoleService,
    // Study: Bring `updateOrganizationRoleService` into scope from the imported module.
    updateOrganizationRoleService,
    // Study: Bring `deleteOrganizationRoleService` into scope from the imported module.
    deleteOrganizationRoleService,
// Study: Close this group and continue the enclosing expression.
} from "./role.service";

// ==========================================
// GLOBAL ROLE CONTROLLERS
// ==========================================

// Study: Export `createGlobalRoleController` as an async function that returns a promise.
export const createGlobalRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Call `createGlobalRoleService` and wait for it to finish and store its result in `role`.
        const role = await createGlobalRoleService(req.body);
        // Study: Return `res.status(201).json({ success: true, message: "Global role created successfully.",…` to the caller.
        return res.status(201).json({ success: true, message: "Global role created successfully.", data: { role } });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `getGlobalRolesController` as an async function that returns a promise.
export const getGlobalRolesController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Call `getGlobalRolesService` and wait for it to finish and store its result in `roles`.
        const roles = await getGlobalRolesService();
        // Study: Return `res.status(200).json({ success: true, message: "Global roles retrieved successfully…` to the caller.
        return res.status(200).json({ success: true, message: "Global roles retrieved successfully.", data: { roles } });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `getGlobalRoleController` as an async function that returns a promise.
export const getGlobalRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Call `getGlobalRoleService` and wait for it to finish and store its result in `role`.
        const role = await getGlobalRoleService(req.params.id as string);
        // Study: Return `res.status(200).json({ success: true, message: "Global role retrieved successfully.…` to the caller.
        return res.status(200).json({ success: true, message: "Global role retrieved successfully.", data: { role } });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `updateGlobalRoleController` as an async function that returns a promise.
export const updateGlobalRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Call `updateGlobalRoleService` and wait for it to finish and store its result in `role`.
        const role = await updateGlobalRoleService(req.params.id as string, req.body);
        // Study: Return `res.status(200).json({ success: true, message: "Global role updated successfully.",…` to the caller.
        return res.status(200).json({ success: true, message: "Global role updated successfully.", data: { role } });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `deleteGlobalRoleController` as an async function that returns a promise.
export const deleteGlobalRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Call `deleteGlobalRoleService` and wait for it to finish and store its result in `role`.
        const role = await deleteGlobalRoleService(req.params.id as string);
        // Study: Return `res.status(200).json({ success: true, message: "Global role deleted successfully.",…` to the caller.
        return res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Global role deleted successfully."`.
            message: "Global role deleted successfully.",
            // Study: Supply the values to write to the database.
            data: { role },
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

// ==========================================
// ORGANIZATION ROLE CONTROLLERS
// ==========================================

// Study: Export `createOrganizationRoleController` as an async function that returns a promise.
export const createOrganizationRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `organizationId` to `req.user!.organizationId!`.
        const organizationId = req.user!.organizationId!;
        // Study: Call `createOrganizationRoleService` and wait for it to finish and store its result in `role`.
        const role = await createOrganizationRoleService(organizationId, req.body);
        // Study: Return `res.status(201).json({ success: true, message: "Organization role created successfu…` to the caller.
        return res.status(201).json({ success: true, message: "Organization role created successfully.", data: { role } });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `getOrganizationRolesController` as an async function that returns a promise.
export const getOrganizationRolesController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `organizationId` to `req.user!.organizationId!`.
        const organizationId = req.user!.organizationId!;
        // Study: Call `getOrganizationRolesService` and wait for it to finish and store its result in `roles`.
        const roles = await getOrganizationRolesService(organizationId);
        // Study: Return `res.status(200).json({ success: true, message: "Organization roles retrieved succes…` to the caller.
        return res.status(200).json({ success: true, message: "Organization roles retrieved successfully.", data: { roles } });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `getOrganizationRoleController` as an async function that returns a promise.
export const getOrganizationRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `organizationId` to `req.user!.organizationId!`.
        const organizationId = req.user!.organizationId!;
        // Study: Call `getOrganizationRoleService` and wait for it to finish and store its result in `role`.
        const role = await getOrganizationRoleService(req.params.id as string, organizationId);
        // Study: Return `res.status(200).json({ success: true, message: "Organization role retrieved success…` to the caller.
        return res.status(200).json({ success: true, message: "Organization role retrieved successfully.", data: { role } });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `updateOrganizationRoleController` as an async function that returns a promise.
export const updateOrganizationRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `organizationId` to `req.user!.organizationId!`.
        const organizationId = req.user!.organizationId!;
        // Study: Call `updateOrganizationRoleService` and wait for it to finish and store its result in `role`.
        const role = await updateOrganizationRoleService(req.params.id as string, organizationId, req.body);
        // Study: Return `res.status(200).json({ success: true, message: "Organization role updated successfu…` to the caller.
        return res.status(200).json({ success: true, message: "Organization role updated successfully.", data: { role } });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `deleteOrganizationRoleController` as an async function that returns a promise.
export const deleteOrganizationRoleController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `organizationId` to `req.user!.organizationId!`.
        const organizationId = req.user!.organizationId!;
        // Study: Call `deleteOrganizationRoleService` and wait for it to finish and store its result in `role`.
        const role = await deleteOrganizationRoleService(req.params.id as string, organizationId);
        // Study: Return `res.status(200).json({ success: true, message: "Organization role deleted successfu…` to the caller.
        return res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Organization role deleted successfully."`.
            message: "Organization role deleted successfully.",
            // Study: Supply the values to write to the database.
            data: { role },
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