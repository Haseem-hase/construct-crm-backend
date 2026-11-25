// Study: Translate HTTP requests into service calls and send HTTP responses for organizations and their owners.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";

// Study: Import `* as organizationService` from `"./organization.service"`.
import * as organizationService from "./organization.service";
// Study: Import `{ ListOrganizationsQuery }` from `"./organization.types"`.
import { ListOrganizationsQuery } from "./organization.types";

// Study: Export `registerOrganization` as an async function that returns a promise.
export const registerOrganization = async (
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
        // Study: Call `organizationService.registerOrganization` and wait for it to finish and store its result in `result`.
        const result =
            // Study: Call `organizationService.registerOrganization` and wait for it to finish.
            await organizationService.registerOrganization(
                // Study: Supply `req` to the surrounding statement.
                req.body
            // Study: Close the call arguments.
            );

        // Study: Send a JSON response to the client.
        res.status(201).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Organization registered successfully."`.
            message: "Organization registered successfully.",
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

// Study: Export `listOrganizations` as an async function that returns a promise.
export const listOrganizations = async (
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
        // Study: Call `organizationService.listOrganizations` and wait for it to finish and store its result in `result`.
        const result = await organizationService.listOrganizations(
            // Study: Supply `res` to the surrounding statement.
            res.locals.validatedQuery as ListOrganizationsQuery
        // Study: Close the call arguments.
        );
        // Study: Return `res.status(200).json({ success: true, message: "Organizations retrieved successfull…` to the caller.
        return res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Organizations retrieved successfully."`.
            message: "Organizations retrieved successfully.",
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

// Study: Export `createOrganization` as an async function that returns a promise.
export const createOrganization = async (
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
        // Study: Call `organizationService.createOrganization` and wait for it to finish and store its result in `result`.
        const result = await organizationService.createOrganization(req.body);
        // Study: Return `res.status(201).json({ success: true, message: "Organization created successfully."…` to the caller.
        return res.status(201).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Organization created successfully."`.
            message: "Organization created successfully.",
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
