// Study: Translate HTTP requests into service calls and send HTTP responses for relationships between projects and customers.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";
// Study: Import `* as projectCustomerService` from `"./project-customer.service"`.
import * as projectCustomerService from "./project-customer.service";
// Study: Import `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"`.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Import `{ ProjectIdAndProjectCustomerIdParams }` from `"./project-customer.types"`.
import { ProjectIdAndProjectCustomerIdParams } from "./project-customer.types";
// Study: Import `{ createProjectCustomerSchema, updateProjectCustomerSchema, projectIdAndProjectCust…` from `"./project-customer.validation"`.
import {
    // Study: Bring `createProjectCustomerSchema` into scope from the imported module.
    createProjectCustomerSchema,
    // Study: Bring `updateProjectCustomerSchema` into scope from the imported module.
    updateProjectCustomerSchema,
    // Study: Bring `projectIdAndProjectCustomerIdParamsSchema` into scope from the imported module.
    projectIdAndProjectCustomerIdParamsSchema,
    // Study: Bring `projectIdSchema` into scope from the imported module.
    projectIdSchema
// Study: Close this group and continue the enclosing expression.
} from "./project-customer.validation";

// Study: Export `createProjectCustomer` as an async function that returns a promise.
export const createProjectCustomer = async (
    // Study: Accept `req` with type `Request<{ projectId: string }>`.
    req: Request<{ projectId: string }>,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Validate `req.params` with `projectIdSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdSchema.parse(req.params);
        // Study: Validate `req.body` with `createProjectCustomerSchema` and obtain the parsed value and store the result as `validatedBody`.
        const validatedBody = createProjectCustomerSchema.parse(req.body);
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Call `projectCustomerService.createProjectCustomer` and wait for it to finish and store its result in `result`.
        const result = await projectCustomerService.createProjectCustomer(
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectId,
            // Study: Supply `validatedBody` to the surrounding statement.
            validatedBody.customerId,
            // Study: Supply `validatedBody` to the surrounding statement.
            validatedBody,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(201).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Project customer created successfully."`.
            message: "Project customer created successfully.",
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

// Study: Export `getProjectCustomers` as an async function that returns a promise.
export const getProjectCustomers = async (
    // Study: Accept `req` with type `Request<{ projectId: string }>`.
    req: Request<{ projectId: string }>,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Validate `req.params` with `projectIdSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdSchema.parse(req.params);
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Call `projectCustomerService.getProjectCustomers` and wait for it to finish and store its result in `result`.
        const result = await projectCustomerService.getProjectCustomers(
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectId,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Project customers retrieved successfully."`.
            message: "Project customers retrieved successfully.",
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

// Study: Export `getProjectCustomer` as an async function that returns a promise.
export const getProjectCustomer = async (
    // Study: Accept `req` with type `Request<ProjectIdAndProjectCustomerIdParams>`.
    req: Request<ProjectIdAndProjectCustomerIdParams>,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Validate `req.params` with `projectIdAndProjectCustomerIdParamsSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdAndProjectCustomerIdParamsSchema.parse(req.params);
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Call `projectCustomerService.getProjectCustomer` and wait for it to finish and store its result in `result`.
        const result = await projectCustomerService.getProjectCustomer(
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectId,
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectCustomerId,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Project customer retrieved successfully."`.
            message: "Project customer retrieved successfully.",
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

// Study: Export `updateProjectCustomer` as an async function that returns a promise.
export const updateProjectCustomer = async (
    // Study: Accept `req` with type `Request<ProjectIdAndProjectCustomerIdParams>`.
    req: Request<ProjectIdAndProjectCustomerIdParams>,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Validate `req.params` with `projectIdAndProjectCustomerIdParamsSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdAndProjectCustomerIdParamsSchema.parse(req.params);
        // Study: Validate `req.body` with `updateProjectCustomerSchema` and obtain the parsed value and store the result as `validatedBody`.
        const validatedBody = updateProjectCustomerSchema.parse(req.body);
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Call `projectCustomerService.updateProjectCustomer` and wait for it to finish and store its result in `result`.
        const result = await projectCustomerService.updateProjectCustomer(
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectId,
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectCustomerId,
            // Study: Supply `validatedBody` to the surrounding statement.
            validatedBody,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Project customer updated successfully."`.
            message: "Project customer updated successfully.",
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

// Study: Export `deleteProjectCustomer` as an async function that returns a promise.
export const deleteProjectCustomer = async (
    // Study: Accept `req` with type `Request<ProjectIdAndProjectCustomerIdParams>`.
    req: Request<ProjectIdAndProjectCustomerIdParams>,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Validate `req.params` with `projectIdAndProjectCustomerIdParamsSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdAndProjectCustomerIdParamsSchema.parse(req.params);
        // Study: Set `user` to `req.user as AuthenticatedUser`.
        const user = req.user as AuthenticatedUser;

        // Study: Call `projectCustomerService.deleteProjectCustomer` and wait for it to finish and store its result in `result`.
        const result = await projectCustomerService.deleteProjectCustomer(
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectId,
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectCustomerId,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Project customer deleted successfully."`.
            message: "Project customer deleted successfully.",
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
