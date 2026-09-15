import { Request, Response, NextFunction } from "express";
import * as projectCustomerService from "./project-customer.service";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
import { ProjectIdAndProjectCustomerIdParams } from "./project-customer.types";

export const createProjectCustomer = async (
    req: Request<{ projectId: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const { customerId, relationshipType, isPrimary } = req.body;
        const user = req.user as AuthenticatedUser;

        const result = await projectCustomerService.createProjectCustomer(
            req.params.projectId,
            customerId,
            req.body,
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
        const user = req.user as AuthenticatedUser;

        const result = await projectCustomerService.getProjectCustomers(
            req.params.projectId,
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
        const user = req.user as AuthenticatedUser;

        const result = await projectCustomerService.getProjectCustomer(
            req.params.projectId,
            req.params.projectCustomerId,
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
        const user = req.user as AuthenticatedUser;

        const result = await projectCustomerService.updateProjectCustomer(
            req.params.projectId,
            req.params.projectCustomerId,
            req.body,
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
        const user = req.user as AuthenticatedUser;

        const result = await projectCustomerService.deleteProjectCustomer(
            req.params.projectId,
            req.params.projectCustomerId,
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
