// Study: Convert errors passed through Express into consistent HTTP responses.
// Study: Import `{ NextFunction, Request, Response }` from `"express"`.
import { NextFunction, Request, Response } from "express";
// Study: Import `{ AppError }` from `"../errors/AppError"`.
import { AppError } from "../errors/AppError";
// Study: Import `{ JsonWebTokenError, TokenExpiredError }` from `"jsonwebtoken"`.
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
// Study: Import `{ Prisma }` from `"@prisma/client"`.
import { Prisma } from "@prisma/client";
// Study: Import `{ ZodError }` from `"zod"`.
import { ZodError } from "zod";

// Study: Export `errorHandler` as a reusable function.
export const errorHandler = (
    // Study: Accept `err` with type `Error`.
    err: Error,
    // Study: Accept `req` with type `Request`.
    req: Request,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {

    // Study: Run the following branch when `err instanceof AppError` is truthy.
    if (err instanceof AppError) {
        // Study: Return `res.status(err.statusCode).json({ success: false, message: err.message, })` to the caller.
        return res.status(err.statusCode).json({
            // Study: Set `success` to `false`.
            success: false,
            // Study: Set `message` to `err.message`.
            message: err.message,
        // Study: Close the object literal.
        });
    // Study: Close the code block.
    }

    // Study: Run the following branch when `err instanceof ZodError` is truthy.
    if (err instanceof ZodError) {
        // Study: Return `res.status(400).json({ success: false, message: "Validation failed.", errors: err.i…` to the caller.
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
            // Study: Close the object literal.
            })),
        // Study: Close the object literal.
        });
    // Study: Close the code block.
    }

    // Study: Run the following branch when `err instanceof TokenExpiredError` is truthy.
    if (err instanceof TokenExpiredError) {
        // Study: Return `res.status(401).json({ success: false, message: "Token has expired.", })` to the caller.
        return res.status(401).json({
            // Study: Set `success` to `false`.
            success: false,
            // Study: Set `message` to `"Token has expired."`.
            message: "Token has expired.",
        // Study: Close the object literal.
        });
    // Study: Close the code block.
    }

    // Study: Run the following branch when `err instanceof JsonWebTokenError` is truthy.
    if (err instanceof JsonWebTokenError) {
        // Study: Return `res.status(401).json({ success: false, message: "Invalid token.", })` to the caller.
        return res.status(401).json({
            // Study: Set `success` to `false`.
            success: false,
            // Study: Set `message` to `"Invalid token."`.
            message: "Invalid token.",
        // Study: Close the object literal.
        });
    // Study: Close the code block.
    }

    // Study: Run the following branch when `err instanceof Prisma.PrismaClientKnownRequestError` is truthy.
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // Study: Run the following branch when `err.code === "P2002"` is truthy.
        if (err.code === "P2002") {
            // Study: Return `res.status(409).json({ success: false, message: "Unique constraint failed. A record…` to the caller.
            return res.status(409).json({
                // Study: Set `success` to `false`.
                success: false,
                // Study: Set `message` to `"Unique constraint failed. A record with this value already exists."`.
                message: "Unique constraint failed. A record with this value already exists.",
            // Study: Close the object literal.
            });
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Study: Call `console.error`.
    console.error(err);

    // Study: Return `res.status(500).json({ success: false, message: "Internal Server Error", })` to the caller.
    return res.status(500).json({
        // Study: Set `success` to `false`.
        success: false,
        // Study: Set `message` to `"Internal Server Error"`.
        message: "Internal Server Error",
    // Study: Close the object literal.
    });
// Study: Close the code block.
};


//"Is this error one of our custom errors?"   err instace of AppError
