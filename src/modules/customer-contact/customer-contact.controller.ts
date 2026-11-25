// Study: This file is about the people you can contact at a customer account. Takes information sent by the screen, asks the backend to do the work, and sends back the result.
// Study: Bring in `{ Request, Response, NextFunction }` from `"express"` so this file can use it.
import { Request, Response, NextFunction } from "express";
// Study: Bring in `* as customerContactService` from `"./customer-contact.service"` so this file can use it.
import * as customerContactService from "./customer-contact.service";
// Study: Bring in `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"` so this file can use it.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Bring in `{ CustomerAndContactIdParams }` from `"./customer-contact.types"` so this file can use it.
import { CustomerAndContactIdParams } from "./customer-contact.types";

// Study: Make `createCustomerContact` available to other files. Its result arrives after its work finishes.
export const createCustomerContact = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<{ customerId: string }>,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;

        // Study: Call `customerContactService.createCustomerContact` and wait for it to finish and store its result in `contact`.
        const contact = await customerContactService.createCustomerContact(
            // Study: Supply `req` to the surrounding statement.
            req.params.customerId,
            // Study: Supply `req` to the surrounding statement.
            req.body,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(201).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Customer contact created successfully."`.
            message: "Customer contact created successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `contact` into the new group under the same name.
                contact,
            // Study: End this group of values.
            },
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

// Study: Make `getCustomerContacts` available to other files. Its result arrives after its work finishes.
export const getCustomerContacts = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<{ customerId: string }>,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;

        // Study: Call `customerContactService.getCustomerContacts` and wait for it to finish and store its result in `contacts`.
        const contacts = await customerContactService.getCustomerContacts(
            // Study: Supply `req` to the surrounding statement.
            req.params.customerId,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Customer contacts retrieved successfully."`.
            message: "Customer contacts retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `contacts` into the new group under the same name.
                contacts,
            // Study: End this group of values.
            },
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

// Study: Make `getCustomerContactById` available to other files. Its result arrives after its work finishes.
export const getCustomerContactById = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<CustomerAndContactIdParams>,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;

        // Study: Call `customerContactService.getCustomerContactById` and wait for it to finish and store its result in `contact`.
        const contact = await customerContactService.getCustomerContactById(
            // Study: Supply `req` to the surrounding statement.
            req.params.customerId,
            // Study: Supply `req` to the surrounding statement.
            req.params.contactId,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Customer contact retrieved successfully."`.
            message: "Customer contact retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `contact` into the new group under the same name.
                contact,
            // Study: End this group of values.
            },
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

// Study: Make `updateCustomerContact` available to other files. Its result arrives after its work finishes.
export const updateCustomerContact = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<CustomerAndContactIdParams>,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Use the signed-in account attached to this request.
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
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Customer contact updated successfully."`.
            message: "Customer contact updated successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `contact` into the new group under the same name.
                contact,
            // Study: End this group of values.
            },
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

// Study: Make `deleteCustomerContact` available to other files. Its result arrives after its work finishes.
export const deleteCustomerContact = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<CustomerAndContactIdParams>,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;

        // Study: Call `customerContactService.deleteCustomerContact` and wait for it to finish and store its result in `result`.
        const result = await customerContactService.deleteCustomerContact(
            // Study: Supply `req` to the surrounding statement.
            req.params.customerId,
            // Study: Supply `req` to the surrounding statement.
            req.params.contactId,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Customer contact deleted successfully."`.
            message: "Customer contact deleted successfully.",
            // Study: Set `data` to `result`.
            data: result,
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
