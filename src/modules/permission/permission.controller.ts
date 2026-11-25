// Study: This file is about the list of actions people can be allowed to take. Takes information sent by the screen, asks the backend to do the work, and sends back the result.
// Study: Bring in `{ Request, Response, NextFunction }` from `"express"` so this file can use it.
import { Request, Response, NextFunction } from "express";
// Study: Bring in `{ getAllPermissionsService }` from `"./permission.service"` so this file can use it.
import { getAllPermissionsService } from "./permission.service";

// Study: Make `getPermissionsController` available to other files. Its result arrives after its work finishes.
export const getPermissionsController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Call `getAllPermissionsService` and wait for it to finish and store its result in `permissions`.
        const permissions = await getAllPermissionsService();
        // Study: Give `res.status(200).json({ success: true, message: "Permissions retrieved successfully.…` back to the code that asked for it.
        return res.status(200).json({ success: true, message: "Permissions retrieved successfully.", data: { permissions } });
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};
