import { Request, Response, NextFunction } from "express";

import * as organizationService from "./organization.service";
import { ListOrganizationsQuery } from "./organization.types";

export const registerOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result =
            await organizationService.registerOrganization(
                req.body
            );

        res.status(201).json({
            success: true,
            message: "Organization registered successfully.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const listOrganizations = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await organizationService.listOrganizations(
            res.locals.validatedQuery as ListOrganizationsQuery
        );
        return res.status(200).json({
            success: true,
            message: "Organizations retrieved successfully.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const createOrganization = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const result = await organizationService.createOrganization(req.body);
        return res.status(201).json({
            success: true,
            message: "Organization created successfully.",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};
