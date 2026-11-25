// Study: This file is about customer accounts and which customers belong under a parent customer. Takes information sent by the screen, asks the backend to do the work, and sends back the result.
// Study: Bring in `{ Request, Response, NextFunction }` from `"express"` so this file can use it.
import { Request, Response, NextFunction } from "express";

// Study: Bring in `* as customerService` from `"./customer.service"` so this file can use it.
import * as customerService from "./customer.service";

// Study: Bring in `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"` so this file can use it.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";


// Create Customer
// Study: Make `createCustomer` available to other files. Its result arrives after its work finishes.
export const createCustomer = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request,
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

        // Study: Call `customerService.createCustomer` and wait for it to finish and store its result in `customer`.
        const customer = await customerService.createCustomer(
            // Study: Start the object passed to the surrounding expression.
            {
                // Study: Expand the values from `req.body` into the surrounding collection.
                ...req.body,
                // Study: Expand the values from `(req.file && user.organizationId ? { profileImageUrl: '/uploads/customers/${user.or…` into the surrounding collection.
                ...(req.file && user.organizationId ? { profileImageUrl: `/uploads/customers/${user.organizationId}/${req.file.filename}` } : {}),
            // Study: End this group of values.
            },
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(201).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Customer created successfully."`.
            message: "Customer created successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `customer` into the new group under the same name.
                customer,
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


// Get All Customers
// Study: Make `getCustomers` available to other files. Its result arrives after its work finishes.
export const getCustomers = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request,
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

        // Study: Call `customerService.getCustomers` and wait for it to finish and store its result in `customers`.
        const customers = await customerService.getCustomers(
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Customers retrieved successfully."`.
            message: "Customers retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `customers` into the new group under the same name.
                customers,
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


// Get Customer By ID
// Study: Make `getCustomerById` available to other files. Its result arrives after its work finishes.
export const getCustomerById = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<{ id: string }>,
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

        // Study: Call `customerService.getCustomerById` and wait for it to finish and store its result in `customer`.
        const customer = await customerService.getCustomerById(
            // Study: Supply `req` to the surrounding statement.
            req.params.id,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Customer retrieved successfully."`.
            message: "Customer retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `customer` into the new group under the same name.
                customer,
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


// Get Customer Children
// Study: Make `getCustomerChildren` available to other files. Its result arrives after its work finishes.
export const getCustomerChildren = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<{ id: string }>,
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

        // Study: Call `customerService.getCustomerChildren` and wait for it to finish and store its result in `customers`.
        const customers = await customerService.getCustomerChildren(
            // Study: Supply `req` to the surrounding statement.
            req.params.id,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Customer children retrieved successfully."`.
            message: "Customer children retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `customers` into the new group under the same name.
                customers,
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


// Update Customer
// Study: Make `updateCustomer` available to other files. Its result arrives after its work finishes.
export const updateCustomer = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<{ id: string }>,
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

        // Study: Call `customerService.updateCustomer` and wait for it to finish and store its result in `customer`.
        const customer = await customerService.updateCustomer(
            // Study: Supply `req` to the surrounding statement.
            req.params.id,
            // Study: Start the object passed to the surrounding expression.
            {
                // Study: Expand the values from `req.body` into the surrounding collection.
                ...req.body,
                // Study: Expand the values from `(req.file && user.organizationId ? { profileImageUrl: '/uploads/customers/${user.or…` into the surrounding collection.
                ...(req.file && user.organizationId ? { profileImageUrl: `/uploads/customers/${user.organizationId}/${req.file.filename}` } : {}),
            // Study: End this group of values.
            },
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Customer updated successfully."`.
            message: "Customer updated successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `customer` into the new group under the same name.
                customer,
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


// Delete Customer
// Study: Make `deleteCustomer` available to other files. Its result arrives after its work finishes.
export const deleteCustomer = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<{ id: string }>,
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

        // Study: Call `customerService.deleteCustomer` and wait for it to finish and store its result in `result`.
        const result = await customerService.deleteCustomer(
            // Study: Supply `req` to the surrounding statement.
            req.params.id,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Customer deleted successfully."`.
            message: "Customer deleted successfully.",
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
