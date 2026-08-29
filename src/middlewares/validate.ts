import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import { BadRequestError } from "../errors/BadRequestError";

export const validate = (schema: ZodSchema) => {
    return (
        req: Request,
        _res: Response,
        next: NextFunction
    ) => {
        try {
            req.body = schema.parse(req.body);

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const message = error.issues[0]?.message || "Invalid request.";

                next(new BadRequestError(message));
                return;
            }

            next(error);
        }
    };
};