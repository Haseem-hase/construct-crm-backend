import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/AppError";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { success } from "zod";

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

    if (err instanceof TokenExpiredError) {
        return res.status(401).json({
            success: false,
            message: "Access token has expired.",
        });
    }

    if (err instanceof JsonWebTokenError) {
        return res.status(401).json({
            success: false,
            message: "Invalid access token.",
        });
    }

    console.error(err);

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
    });
};


//"Is this error one of our custom errors?"   err instace of AppError