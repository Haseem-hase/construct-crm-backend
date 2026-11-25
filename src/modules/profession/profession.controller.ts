// Study: This file is about the list of trades workers can be recorded under. Takes information sent by the screen, asks the backend to do the work, and sends back the result.
// Study: Bring in `{ Request, Response, NextFunction }` from `"express"` so this file can use it.
import { Request, Response, NextFunction } from "express";
// Study: Bring in `* as professionService` from `"./profession.service"` so this file can use it.
import * as professionService from "./profession.service";

// Study: Make `getProfessions` available to other files. Its result arrives after its work finishes.
export const getProfessions = async (
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
        // Study: Call `professionService.getProfessions` and wait for it to finish and store its result in `professions`.
        const professions = await professionService.getProfessions();

        // Study: Send named information back to the screen as JSON.
        res.status(200).json({
            // Study: Tell the screen that the request succeeded.
            success: true,
            // Study: Set `message` to `"Professions retrieved successfully."`.
            message: "Professions retrieved successfully.",
            // Study: Supply the values to write to the database.
            data: {
                // Study: Carry the value of `professions` into the new group under the same name.
                professions,
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
