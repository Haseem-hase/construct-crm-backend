// Study: Translate HTTP requests into service calls and send HTTP responses for the contractor responsibility catalog.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";

// Study: Import `* as responsibilityService` from `"./responsibility.service"`.
import * as responsibilityService from "./responsibility.service";

// Study: Export `getResponsibilities` as an async function that returns a promise.
export const getResponsibilities = async (
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
        // Study: Call `responsibilityService.getResponsibilities` and wait for it to finish and store its result in `responsibilities`.
        const responsibilities = await responsibilityService.getResponsibilities();

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Responsibilities retrieved successfully."`.
            message: "Responsibilities retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `responsibilities` value under the same property name.
                responsibilities,
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
