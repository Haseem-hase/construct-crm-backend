import { Request, Response, NextFunction } from "express";
import * as customerContactService from "./customer-contact.service";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
import { CustomerAndContactIdParams } from "./customer-contact.types";

export const createCustomerContact = async (
    req: Request<{ customerId: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;

        const contact = await customerContactService.createCustomerContact(
            req.params.customerId,
            req.body,
            user
        );

        res.status(201).json({
            success: true,
            data: {
                contact,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getCustomerContacts = async (
    req: Request<{ customerId: string }>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;

        const contacts = await customerContactService.getCustomerContacts(
            req.params.customerId,
            user
        );

        res.status(200).json({
            success: true,
            data: {
                contacts,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getCustomerContactById = async (
    req: Request<CustomerAndContactIdParams>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;

        const contact = await customerContactService.getCustomerContactById(
            req.params.customerId,
            req.params.contactId,
            user
        );

        res.status(200).json({
            success: true,
            data: {
                contact,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const updateCustomerContact = async (
    req: Request<CustomerAndContactIdParams>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;

        const contact = await customerContactService.updateCustomerContact(
            req.params.customerId,
            req.params.contactId,
            req.body,
            user
        );

        res.status(200).json({
            success: true,
            data: {
                contact,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const deleteCustomerContact = async (
    req: Request<CustomerAndContactIdParams>,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user as AuthenticatedUser;

        const result = await customerContactService.deleteCustomerContact(
            req.params.customerId,
            req.params.contactId,
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
