import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            success: false,
            message: "Validation failed.",
            errors: err.issues.map((e: any) => ({
                path: e.path.join("."),
                message: e.message,
            })),
        });
    }

    if (err instanceof TokenExpiredError) {
        return res.status(401).json({
            success: false,
            message: "Token has expired.",
        });
    }

    if (err instanceof JsonWebTokenError) {
        return res.status(401).json({
            success: false,
            message: "Invalid token.",
        });
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === "P2002") {
            const target = err.meta?.target as string[] | undefined;
            if (target && target.includes("organizationId") && target.includes("phone")) {
                return res.status(409).json({
                    success: false,
                    message: "A labour with this phone number already exists in this organization.",
                });
            }
        }
    }

    console.error(err);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};


//"Is this error one of our custom errors?"   err instace of AppError