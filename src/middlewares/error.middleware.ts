// Study: Turns a problem into a consistent reply that the screen can use to show what went wrong.
// Study: Bring in `{ NextFunction, Request, Response }` from `"express"` so this file can use it.
import { NextFunction, Request, Response } from "express";
// Study: Bring in `{ AppError }` from `"../errors/AppError"` so this file can use it.
import { AppError } from "../errors/AppError";
// Study: Bring in `{ JsonWebTokenError, TokenExpiredError }` from `"jsonwebtoken"` so this file can use it.
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
// Study: Bring in `{ Prisma }` from `"@prisma/client"` so this file can use it.
import { Prisma } from "@prisma/client";
// Study: Bring in `{ ZodError }` from `"zod"` so this file can use it.
import { ZodError } from "zod";

// Study: Set up a reusable step named `errorHandler`.
export const errorHandler = (
    // Study: This step receives `err`. `Error` describes what that information should look like.
    err: Error,
    // Study: Read the information that came in with the request from the screen.
    req: Request,
    // Study: Use this to send information or an error back to the screen.
    res: Response,
    // Study: Use this to move the request to the next check or action.
    next: NextFunction
// Study: Finish this group and continue the surrounding step.
) => {

    // Study: Do the next step if this check passes: `err instanceof AppError`.
    if (err instanceof AppError) {
        // Study: Give `res.status(err.statusCode).json({ success: false, message: err.message, })` back to the code that asked for it.
        return res.status(err.statusCode).json({
            // Study: Set `success` to `false`.
            success: false,
            // Study: Set `message` to `err.message`.
            message: err.message,
        // Study: End this group of values.
        });
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `err instanceof ZodError`.
    if (err instanceof ZodError) {
        // Study: Give `res.status(400).json({ success: false, message: "Validation failed.", errors: err.i…` back to the code that asked for it.
        return res.status(400).json({
            // Study: Set `success` to `false`.
            success: false,
            // Study: Set `message` to `"Validation failed."`.
            message: "Validation failed.",
            // Study: Set `errors` to `err.issues.map((e: any) => ({ path: e.path.join("."), message: e.message, }))`.
            errors: err.issues.map((e: any) => ({
                // Study: Set `path` to `e.path.join(".")`.
                path: e.path.join("."),
                // Study: Set `message` to `e.message`.
                message: e.message,
            // Study: End this group of values.
            })),
        // Study: End this group of values.
        });
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `err instanceof TokenExpiredError`.
    if (err instanceof TokenExpiredError) {
        // Study: Give `res.status(401).json({ success: false, message: "Token has expired.", })` back to the code that asked for it.
        return res.status(401).json({
            // Study: Set `success` to `false`.
            success: false,
            // Study: Set `message` to `"Token has expired."`.
            message: "Token has expired.",
        // Study: End this group of values.
        });
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `err instanceof JsonWebTokenError`.
    if (err instanceof JsonWebTokenError) {
        // Study: Give `res.status(401).json({ success: false, message: "Invalid token.", })` back to the code that asked for it.
        return res.status(401).json({
            // Study: Set `success` to `false`.
            success: false,
            // Study: Set `message` to `"Invalid token."`.
            message: "Invalid token.",
        // Study: End this group of values.
        });
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `err instanceof Prisma.PrismaClientKnownRequestError`.
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Study: Do the next step if this check passes: `err.code === "P2002"`.
        if (err.code === "P2002") {
            // Study: Give `res.status(409).json({ success: false, message: "Unique constraint failed. A record…` back to the code that asked for it.
            return res.status(409).json({
                // Study: Set `success` to `false`.
                success: false,
                // Study: Set `message` to `"Unique constraint failed. A record with this value already exists."`.
                message: "Unique constraint failed. A record with this value already exists.",
            // Study: End this group of values.
            });
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Study: Call `console.error`.
    console.error(err);

    // Study: Give `res.status(500).json({ success: false, message: "Internal Server Error", })` back to the code that asked for it.
    return res.status(500).json({
        // Study: Set `success` to `false`.
        success: false,
        // Study: Set `message` to `"Internal Server Error"`.
        message: "Internal Server Error",
    // Study: End this group of values.
    });
// Study: End this group of steps.
};


//"Is this error one of our custom errors?"   err instace of AppError
