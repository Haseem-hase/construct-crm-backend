// Study: Translate HTTP requests into service calls and send HTTP responses for the worker profession catalog.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";
// Study: Import `* as professionService` from `"./profession.service"`.
import * as professionService from "./profession.service";

// Study: Export `getProfessions` as an async function that returns a promise.
export const getProfessions = async (
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
        // Study: Call `professionService.getProfessions` and wait for it to finish and store its result in `professions`.
        const professions = await professionService.getProfessions();

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Professions retrieved successfully."`.
            message: "Professions retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Pass the current `professions` value under the same property name.
                professions,
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
