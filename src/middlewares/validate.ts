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
        res: Response,
        next: NextFunction
    ) => {
        try {
            const validatedData = schema.parse(req[source]);

            // Express 5 exposes req.query through a getter, so keep parsed
            // query values in res.locals instead of assigning to req.query.
            if (source === "query") {
                res.locals.validatedQuery = validatedData;
            } else {
                req[source] = validatedData;
            }

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
