// Study: This file is about which customers are connected to each job and in what role. Takes information sent by the screen, asks the backend to do the work, and sends back the result.
// Study: Bring in `{ Request, Response, NextFunction }` from `"express"` so this file can use it.
import { Request, Response, NextFunction } from "express";
// Study: Bring in `* as projectCustomerService` from `"./project-customer.service"` so this file can use it.
import * as projectCustomerService from "./project-customer.service";
// Study: Bring in `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"` so this file can use it.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Bring in `{ ProjectIdAndProjectCustomerIdParams }` from `"./project-customer.types"` so this file can use it.
import { ProjectIdAndProjectCustomerIdParams } from "./project-customer.types";
// Study: Bring in `{ createProjectCustomerSchema, updateProjectCustomerSchema, projectIdAndProjectCust…` from `"./project-customer.validation"` so this file can use it.
import {
    // Study: Make `createProjectCustomerSchema` from the other file available here.
    createProjectCustomerSchema,
    // Study: Make `updateProjectCustomerSchema` from the other file available here.
    updateProjectCustomerSchema,
    // Study: Make `projectIdAndProjectCustomerIdParamsSchema` from the other file available here.
    projectIdAndProjectCustomerIdParamsSchema,
    // Study: Make `projectIdSchema` from the other file available here.
    projectIdSchema
// Study: Finish this group and continue the surrounding step.
} from "./project-customer.validation";

// Study: Make `createProjectCustomer` available to other files. Its result arrives after its work finishes.
export const createProjectCustomer = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<{ projectId: string }>,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Check `req.params` using the rule `projectIdSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdSchema.parse(req.params);
        // Study: Check `req.body` using the rule `createProjectCustomerSchema` and obtain the parsed value and store the result as `validatedBody`.
        const validatedBody = createProjectCustomerSchema.parse(req.body);
        // Study: Use the signed-in account attached to this request.
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
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(201).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Project customer created successfully."`.
            message: "Project customer created successfully.",
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

// Study: Make `getProjectCustomers` available to other files. Its result arrives after its work finishes.
export const getProjectCustomers = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<{ projectId: string }>,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Check `req.params` using the rule `projectIdSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdSchema.parse(req.params);
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;

        // Study: Call `projectCustomerService.getProjectCustomers` and wait for it to finish and store its result in `result`.
        const result = await projectCustomerService.getProjectCustomers(
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectId,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Project customers retrieved successfully."`.
            message: "Project customers retrieved successfully.",
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

// Study: Make `getProjectCustomer` available to other files. Its result arrives after its work finishes.
export const getProjectCustomer = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<ProjectIdAndProjectCustomerIdParams>,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Check `req.params` using the rule `projectIdAndProjectCustomerIdParamsSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdAndProjectCustomerIdParamsSchema.parse(req.params);
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;

        // Study: Call `projectCustomerService.getProjectCustomer` and wait for it to finish and store its result in `result`.
        const result = await projectCustomerService.getProjectCustomer(
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectId,
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectCustomerId,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Project customer retrieved successfully."`.
            message: "Project customer retrieved successfully.",
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

// Study: Make `updateProjectCustomer` available to other files. Its result arrives after its work finishes.
export const updateProjectCustomer = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<ProjectIdAndProjectCustomerIdParams>,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Check `req.params` using the rule `projectIdAndProjectCustomerIdParamsSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdAndProjectCustomerIdParamsSchema.parse(req.params);
        // Study: Check `req.body` using the rule `updateProjectCustomerSchema` and obtain the parsed value and store the result as `validatedBody`.
        const validatedBody = updateProjectCustomerSchema.parse(req.body);
        // Study: Use the signed-in account attached to this request.
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
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Project customer updated successfully."`.
            message: "Project customer updated successfully.",
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

// Study: Make `deleteProjectCustomer` available to other files. Its result arrives after its work finishes.
export const deleteProjectCustomer = async (
    // Study: Read the information that came in with the request from the screen.
    req: Request<ProjectIdAndProjectCustomerIdParams>,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Check `req.params` using the rule `projectIdAndProjectCustomerIdParamsSchema` and obtain the parsed value and store the result as `validatedParams`.
        const validatedParams = projectIdAndProjectCustomerIdParamsSchema.parse(req.params);
        // Study: Use the signed-in account attached to this request.
        const user = req.user as AuthenticatedUser;

        // Study: Call `projectCustomerService.deleteProjectCustomer` and wait for it to finish and store its result in `result`.
        const result = await projectCustomerService.deleteProjectCustomer(
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectId,
            // Study: Supply `validatedParams` to the surrounding statement.
            validatedParams.projectCustomerId,
            // Study: Supply `user` to the surrounding statement.
            user
        // Study: End the list of information being sent to this step.
        );

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Project customer deleted successfully."`.
            message: "Project customer deleted successfully.",
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
