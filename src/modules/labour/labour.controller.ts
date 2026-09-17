import { Request, Response, NextFunction } from "express";

import * as labourService from "./labour.service";

import { AuthenticatedUser } from "../../shared/types/authenticated-user";
import { UnauthorizedError } from "../../errors/UnauthorizedError";

import {
    createLabourSchema,
    updateLabourSchema,
    labourIdSchema,
} from "./labour.validation";

// Create Labour
export const createLabour = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = createLabourSchema.parse(req.body);
        const user = req.user as AuthenticatedUser;

        if (!user.organizationId) {
            throw new UnauthorizedError(
                "User is not associated with an organization."
            );
        }

        const labour = await labourService.createLabour(
            user.organizationId,
            validatedData
        );

        res.status(201).json({
            success: true,
            data: {
                labour,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get Organization Labours
export const getOrganizationLabours = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;

        if (!user.organizationId) {
            throw new UnauthorizedError(
                "User is not associated with an organization."
            );
        }

        const labours = await labourService.getOrganizationLabours(
            user.organizationId
        );

        res.status(200).json({
            success: true,
            data: {
                labours,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Get Labour By ID
export const getLabourById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const params = labourIdSchema.parse(req.params);
        const user = req.user as AuthenticatedUser;

        if (!user.organizationId) {
            throw new UnauthorizedError(
                "User is not associated with an organization."
            );
        }

        const labour = await labourService.getLabourById(
            params.id,
            user.organizationId
        );

        res.status(200).json({
            success: true,
            data: {
                labour,
            },
        });
    } catch (error) {
        next(error);
    }
};

// Update Labour
export const updateLabour = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const params = labourIdSchema.parse(req.params);
        const validatedData = updateLabourSchema.parse(req.body);
        const user = req.user as AuthenticatedUser;

        if (!user.organizationId) {
            throw new UnauthorizedError(
                "User is not associated with an organization."
            );
        }

        const labour = await labourService.updateLabour(
            params.id,
            user.organizationId,
            validatedData
        );

        res.status(200).json({
            success: true,
            data: {
                labour,
            },
        });
    } catch (error) {
        next(error);
    }
};
