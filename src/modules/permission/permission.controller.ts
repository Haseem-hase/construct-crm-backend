// Study: Translate HTTP requests into service calls and send HTTP responses for the module/action permission catalog.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";
// Study: Import `{ getAllPermissionsService }` from `"./permission.service"`.
import { getAllPermissionsService } from "./permission.service";

// Study: Export `getPermissionsController` as an async function that returns a promise.
export const getPermissionsController = async (req: Request, res: Response, next: NextFunction) => {
    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Call `getAllPermissionsService` and wait for it to finish and store its result in `permissions`.
        const permissions = await getAllPermissionsService();
        // Study: Return `res.status(200).json({ success: true, message: "Permissions retrieved successfully.…` to the caller.
        return res.status(200).json({ success: true, message: "Permissions retrieved successfully.", data: { permissions } });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};
