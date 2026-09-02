import { Request, Response, NextFunction } from "express";

import * as customerService from "./customer.service";

import { AuthenticatedUser } from "../../shared/types/authenticated-user";


// Create Customer
export const createCustomer = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;

        const customer = await customerService.createCustomer(
            req.body,
            user
        );

        res.status(201).json({
            success: true,
            data: {
                customer,
            },
        });
    } catch (error) {
        next(error);
    }
};


// Get All Customers
export const getCustomers = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;

        const customers = await customerService.getCustomers(
            user
        );

        res.status(200).json({
            success: true,
            data: {
                customers,
            },
        });
    } catch (error) {
        next(error);
    }
};


// Get Customer By ID
export const getCustomerById = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;

        const customer = await customerService.getCustomerById(
            req.params.id,
            user
        );

        res.status(200).json({
            success: true,
            data: {
                customer,
            },
        });
    } catch (error) {
        next(error);
    }
};


// Update Customer
export const updateCustomer = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;

        const customer = await customerService.updateCustomer(
            req.params.id,
            req.body,
            user
        );

        res.status(200).json({
            success: true,
            data: {
                customer,
            },
        });
    } catch (error) {
        next(error);
    }
};


// Delete Customer
export const deleteCustomer = async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;

        const result = await customerService.deleteCustomer(
            req.params.id,
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