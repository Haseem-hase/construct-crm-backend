// Study: Translate HTTP requests into service calls and send HTTP responses for customer accounts and parent-child customer relationships.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";

// Study: Import `* as customerService` from `"./customer.service"`.
import * as customerService from "./customer.service";

// Study: Import `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"`.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";


// Create Customer
// Study: Export `createCustomer` as an async function that returns a promise.
export const createCustomer = async (
    // Study: Accept `req` with type `Request`.
    req: Request,
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

        // Study: Call `customerService.createCustomer` and wait for it to finish and store its result in `customer`.
        const customer = await customerService.createCustomer(
            // Study: Start the object passed to the surrounding expression.
            {
                // Study: Expand the values from `req.body` into the surrounding collection.
                ...req.body,
                // Study: Expand the values from `(req.file && user.organizationId ? { profileImageUrl: '/uploads/customers/${user.or…` into the surrounding collection.
                ...(req.file && user.organizationId ? { profileImageUrl: `/uploads/customers/${user.organizationId}/${req.file.filename}` } : {}),
            // Study: Close the object literal.
            },
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(201).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Customer created successfully."`.
            message: "Customer created successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `customer` value under the same property name.
                customer,
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


// Get All Customers
// Study: Export `getCustomers` as an async function that returns a promise.
export const getCustomers = async (
    // Study: Accept `req` with type `Request`.
    req: Request,
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

        // Study: Call `customerService.getCustomers` and wait for it to finish and store its result in `customers`.
        const customers = await customerService.getCustomers(
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Customers retrieved successfully."`.
            message: "Customers retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `customers` value under the same property name.
                customers,
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


// Get Customer By ID
// Study: Export `getCustomerById` as an async function that returns a promise.
export const getCustomerById = async (
    // Study: Accept `req` with type `Request<{ id: string }>`.
    req: Request<{ id: string }>,
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

        // Study: Call `customerService.getCustomerById` and wait for it to finish and store its result in `customer`.
        const customer = await customerService.getCustomerById(
            // Study: Supply `req` to the surrounding statement.
            req.params.id,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Customer retrieved successfully."`.
            message: "Customer retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `customer` value under the same property name.
                customer,
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


// Get Customer Children
// Study: Export `getCustomerChildren` as an async function that returns a promise.
export const getCustomerChildren = async (
    // Study: Accept `req` with type `Request<{ id: string }>`.
    req: Request<{ id: string }>,
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

        // Study: Call `customerService.getCustomerChildren` and wait for it to finish and store its result in `customers`.
        const customers = await customerService.getCustomerChildren(
            // Study: Supply `req` to the surrounding statement.
            req.params.id,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Customer children retrieved successfully."`.
            message: "Customer children retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `customers` value under the same property name.
                customers,
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


// Update Customer
// Study: Export `updateCustomer` as an async function that returns a promise.
export const updateCustomer = async (
    // Study: Accept `req` with type `Request<{ id: string }>`.
    req: Request<{ id: string }>,
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
            // Study: Close the object literal.
            },
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Customer updated successfully."`.
            message: "Customer updated successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `customer` value under the same property name.
                customer,
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


// Delete Customer
// Study: Export `deleteCustomer` as an async function that returns a promise.
export const deleteCustomer = async (
    // Study: Accept `req` with type `Request<{ id: string }>`.
    req: Request<{ id: string }>,
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

        // Study: Call `customerService.deleteCustomer` and wait for it to finish and store its result in `result`.
        const result = await customerService.deleteCustomer(
            // Study: Supply `req` to the surrounding statement.
            req.params.id,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Customer deleted successfully."`.
            message: "Customer deleted successfully.",
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
