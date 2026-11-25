// Study: This file is about the companies using the CRM and the people who own their accounts. Takes information sent by the screen, asks the backend to do the work, and sends back the result.
// Study: Bring in `{ Request, Response, NextFunction }` from `"express"` so this file can use it.
import { Request, Response, NextFunction } from "express";

// Study: Bring in `* as organizationService` from `"./organization.service"` so this file can use it.
import * as organizationService from "./organization.service";
// Study: Bring in `{ ListOrganizationsQuery }` from `"./organization.types"` so this file can use it.
import { ListOrganizationsQuery } from "./organization.types";

// Study: Make `registerOrganization` available to other files. Its result arrives after its work finishes.
export const registerOrganization = async (
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
        // Study: Call `organizationService.registerOrganization` and wait for it to finish and store its result in `result`.
        const result =
            // Study: Call `organizationService.registerOrganization` and wait for it to finish.
            await organizationService.registerOrganization(
                // Study: Supply `req` to the surrounding statement.
                req.body
            // Study: End the list of information being sent to this step.
            );

        // Study: Send named information back to the screen as JSON.
        res.status(201).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Organization registered successfully."`.
            message: "Organization registered successfully.",
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

// Study: Make `listOrganizations` available to other files. Its result arrives after its work finishes.
export const listOrganizations = async (
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
        // Study: Call `organizationService.listOrganizations` and wait for it to finish and store its result in `result`.
        const result = await organizationService.listOrganizations(
            // Study: Supply `res` to the surrounding statement.
            res.locals.validatedQuery as ListOrganizationsQuery
        // Study: End the list of information being sent to this step.
        );
        // Study: Give `res.status(200).json({ success: true, message: "Organizations retrieved successfull…` back to the code that asked for it.
        return res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Organizations retrieved successfully."`.
            message: "Organizations retrieved successfully.",
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

// Study: Make `createOrganization` available to other files. Its result arrives after its work finishes.
export const createOrganization = async (
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
        // Study: Call `organizationService.createOrganization` and wait for it to finish and store its result in `result`.
        const result = await organizationService.createOrganization(req.body);
        // Study: Give `res.status(201).json({ success: true, message: "Organization created successfully."…` back to the code that asked for it.
        return res.status(201).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Organization created successfully."`.
            message: "Organization created successfully.",
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
