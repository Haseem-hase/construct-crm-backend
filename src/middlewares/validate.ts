import { Request, Response, NextFunction } from "express";
import { ZodError, ZodSchema } from "zod";
import { BadRequestError } from "../errors/BadRequestError";

type ValidationSource = "body" | "params" | "query";

export const validate = (
    schema: ZodSchema,
    source: ValidationSource = "body"
) => {
    return (
        req: Request,
        _res: Response,
        next: NextFunction
    ) => {
        try {
            const validatedData = schema.parse(req[source]);

            req[source] = validatedData;

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const message =
                    error.issues[0]?.message || "Invalid request.";

                next(new BadRequestError(message));
                return;
            }

            next(error);
        }
    };
};