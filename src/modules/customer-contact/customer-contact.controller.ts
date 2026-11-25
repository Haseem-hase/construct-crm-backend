// Study: Translate HTTP requests into service calls and send HTTP responses for contacts attached to customer accounts.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";
// Study: Import `* as customerContactService` from `"./customer-contact.service"`.
import * as customerContactService from "./customer-contact.service";
// Study: Import `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"`.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Import `{ CustomerAndContactIdParams }` from `"./customer-contact.types"`.
import { CustomerAndContactIdParams } from "./customer-contact.types";

// Study: Export `createCustomerContact` as an async function that returns a promise.
export const createCustomerContact = async (
    // Study: Accept `req` with type `Request<{ customerId: string }>`.
    req: Request<{ customerId: string }>,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Call `customerContactService.createCustomerContact` and wait for it to finish and store its result in `contact`.
        const contact = await customerContactService.createCustomerContact(
            // Study: Supply `req` to the surrounding statement.
            req.params.customerId,
            // Study: Supply `req` to the surrounding statement.
            req.body,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(201).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Customer contact created successfully."`.
            message: "Customer contact created successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `contact` value under the same property name.
                contact,
            // Study: Close the object literal.
            },
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

// Study: Export `getCustomerContacts` as an async function that returns a promise.
export const getCustomerContacts = async (
    // Study: Accept `req` with type `Request<{ customerId: string }>`.
    req: Request<{ customerId: string }>,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Call `customerContactService.getCustomerContacts` and wait for it to finish and store its result in `contacts`.
        const contacts = await customerContactService.getCustomerContacts(
            // Study: Supply `req` to the surrounding statement.
            req.params.customerId,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Customer contacts retrieved successfully."`.
            message: "Customer contacts retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `contacts` value under the same property name.
                contacts,
            // Study: Close the object literal.
            },
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

// Study: Export `getCustomerContactById` as an async function that returns a promise.
export const getCustomerContactById = async (
    // Study: Accept `req` with type `Request<CustomerAndContactIdParams>`.
    req: Request<CustomerAndContactIdParams>,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Call `customerContactService.getCustomerContactById` and wait for it to finish and store its result in `contact`.
        const contact = await customerContactService.getCustomerContactById(
            // Study: Supply `req` to the surrounding statement.
            req.params.customerId,
            // Study: Supply `req` to the surrounding statement.
            req.params.contactId,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Customer contact retrieved successfully."`.
            message: "Customer contact retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `contact` value under the same property name.
                contact,
            // Study: Close the object literal.
            },
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

// Study: Export `updateCustomerContact` as an async function that returns a promise.
export const updateCustomerContact = async (
    // Study: Accept `req` with type `Request<CustomerAndContactIdParams>`.
    req: Request<CustomerAndContactIdParams>,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Call `customerContactService.updateCustomerContact` and wait for it to finish and store its result in `contact`.
        const contact = await customerContactService.updateCustomerContact(
            // Study: Supply `req` to the surrounding statement.
            req.params.customerId,
            // Study: Supply `req` to the surrounding statement.
            req.params.contactId,
            // Study: Supply `req` to the surrounding statement.
            req.body,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Customer contact updated successfully."`.
            message: "Customer contact updated successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `contact` value under the same property name.
                contact,
            // Study: Close the object literal.
            },
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

// Study: Export `deleteCustomerContact` as an async function that returns a promise.
export const deleteCustomerContact = async (
    // Study: Accept `req` with type `Request<CustomerAndContactIdParams>`.
    req: Request<CustomerAndContactIdParams>,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Call `customerContactService.deleteCustomerContact` and wait for it to finish and store its result in `result`.
        const result = await customerContactService.deleteCustomerContact(
            // Study: Supply `req` to the surrounding statement.
            req.params.customerId,
            // Study: Supply `req` to the surrounding statement.
            req.params.contactId,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Customer contact deleted successfully."`.
            message: "Customer contact deleted successfully.",
            // Study: Set `data` to `result`.
            data: result,
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
