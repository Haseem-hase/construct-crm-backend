import { Request, Response, NextFunction } from "express";

import * as contractorService from "./contractor.service";

import { AuthenticatedUser } from "../../shared/types/authenticated-user";
import { ForbiddenError } from "../../errors/ForbiddenError";

import {
    createContractorSchema,
    updateContractorSchema,
    contractorIdSchema,
} from "./contractor.validation";

export const createContractor = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedData = createContractorSchema.parse(req.body);
        const user = req.user as AuthenticatedUser;

        if (!user.organizationId) {
            throw new ForbiddenError(
                "User is not associated with an organization."
            );
        }

        const contractor = await contractorService.createContractor(
            user.organizationId,
            validatedData
        );

        res.status(201).json({
            success: true,
            message: "Contractor created successfully.",
            data: {
                contractor,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getOrganizationContractors = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;

        if (user.systemRole === "SUPER_ADMIN") {
            const contractors = await contractorService.getPlatformContractors();
            res.status(200).json({ success: true, message: "Contractors retrieved successfully.", data: { contractors } });
            return;
        }
        if (!user.organizationId) {
            throw new ForbiddenError(
                "User is not associated with an organization."
            );
        }

        const contractors = await contractorService.getOrganizationContractors(
            user.organizationId
        );

        res.status(200).json({
            success: true,
            message: "Contractors retrieved successfully.",
            data: {
                contractors,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getContractorById = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const params = contractorIdSchema.parse(req.params);
        const user = req.user as AuthenticatedUser;

        if (user.systemRole === "SUPER_ADMIN") {
            const contractor = await contractorService.getPlatformContractorById(params.id);
            res.status(200).json({ success: true, message: "Contractor retrieved successfully.", data: { contractor } });
            return;
        }
        if (!user.organizationId) {
            throw new ForbiddenError(
                "User is not associated with an organization."
            );
        }

        const contractor = await contractorService.getContractorById(
            params.id,
            user.organizationId
        );

        res.status(200).json({
            success: true,
            message: "Contractor retrieved successfully.",
            data: {
                contractor,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const updateContractor = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const params = contractorIdSchema.parse(req.params);
        const validatedData = updateContractorSchema.parse(req.body);
        const user = req.user as AuthenticatedUser;

        if (!user.organizationId) {
            throw new ForbiddenError(
                "User is not associated with an organization."
            );
        }

        const contractor = await contractorService.updateContractor(
            params.id,
            user.organizationId,
            validatedData
        );

        res.status(200).json({
            success: true,
            message: "Contractor updated successfully.",
            data: {
                contractor,
            },
        });
    } catch (error) {
        next(error);
    }
};
