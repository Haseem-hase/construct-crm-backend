import { Request, Response, NextFunction } from "express";
import * as projectCustomerService from "./project-customer.service";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
import { ProjectIdAndProjectCustomerIdParams } from "./project-customer.types";
import {
    createProjectCustomerSchema,
    updateProjectCustomerSchema,
    projectIdAndProjectCustomerIdParamsSchema,
    projectIdSchema
} from "./project-customer.validation";

export const createProjectCustomer = async (
    req: Request<{ projectId: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedParams = projectIdSchema.parse(req.params);
        const validatedBody = createProjectCustomerSchema.parse(req.body);
        const user = req.user as AuthenticatedUser;

        const result = await projectCustomerService.createProjectCustomer(
            validatedParams.projectId,
            validatedBody.customerId,
            validatedBody,
            user
        );

        res.status(201).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const getProjectCustomers = async (
    req: Request<{ projectId: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedParams = projectIdSchema.parse(req.params);
        const user = req.user as AuthenticatedUser;

        const result = await projectCustomerService.getProjectCustomers(
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

export const getProjectCustomer = async (
    req: Request<ProjectIdAndProjectCustomerIdParams>,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedParams = projectIdAndProjectCustomerIdParamsSchema.parse(req.params);
        const user = req.user as AuthenticatedUser;

        const result = await projectCustomerService.getProjectCustomer(
            validatedParams.projectId,
            validatedParams.projectCustomerId,
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

export const updateProjectCustomer = async (
    req: Request<ProjectIdAndProjectCustomerIdParams>,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedParams = projectIdAndProjectCustomerIdParamsSchema.parse(req.params);
        const validatedBody = updateProjectCustomerSchema.parse(req.body);
        const user = req.user as AuthenticatedUser;

        const result = await projectCustomerService.updateProjectCustomer(
            validatedParams.projectId,
            validatedParams.projectCustomerId,
            validatedBody,
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

export const deleteProjectCustomer = async (
    req: Request<ProjectIdAndProjectCustomerIdParams>,
    res: Response,
    next: NextFunction
) => {
    try {
        const validatedParams = projectIdAndProjectCustomerIdParamsSchema.parse(req.params);
        const user = req.user as AuthenticatedUser;

        const result = await projectCustomerService.deleteProjectCustomer(
            validatedParams.projectId,
            validatedParams.projectCustomerId,
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
