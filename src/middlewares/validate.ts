// Study: Parse request data with Zod and pass validated values to downstream handlers.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";
// Study: Import `{ ZodError, ZodSchema }` from `"zod"`.
import { ZodError, ZodSchema } from "zod";
// Study: Import `{ BadRequestError }` from `"../errors/BadRequestError"`.
import { BadRequestError } from "../errors/BadRequestError";

// Study: Define the compile-time contract named `ValidationSource`.
type ValidationSource = "body" | "params" | "query";

// Study: Export `validate` as a reusable function.
export const validate = (
    // Study: Accept `schema` with type `ZodSchema`.
    schema: ZodSchema,
    // Study: Accept `source` with type `ValidationSource` with initial value `"body"`.
    source: ValidationSource = "body"
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `( req: Request, res: Response, next: NextFunction ) => { try { const validatedData …` to the caller.
    return (
        // Study: Accept `req` with type `Request`.
        req: Request,
        // Study: Accept `res` with type `Response`.
        res: Response,
        // Study: Accept `next` with type `NextFunction`.
        next: NextFunction
    // Study: Close this group and continue the enclosing expression.
    ) => {
        // Study: Run this block and handle failures in the associated catch block.
        try {
            // Study: Validate `req[source]` with `schema` and obtain the parsed value and store the result as `validatedData`.
            const validatedData = schema.parse(req[source]);

            // Express 5 exposes req.query through a getter, so keep parsed
            // query values in res.locals instead of assigning to req.query.
            // Study: Run the following branch when `source === "query"` is truthy.
            if (source === "query") {
                // Study: Assign `validatedData` to `res.locals.validatedQuery`.
                res.locals.validatedQuery = validatedData;
            // Study: Run this branch if the preceding conditions failed.
            } else {
                // Study: Assign `validatedData` to `req[source]`.
                req[source] = validatedData;
            // Study: Close the code block.
            }

            // Study: Continue to the next Express middleware or handler.
            next();
        // Study: Handle an exception from the try block as `error`.
        } catch (error) {
            // Study: Run the following branch when `error instanceof ZodError` is truthy.
            if (error instanceof ZodError) {
                // Study: Set `message` to `error.issues[0]?.message || "Invalid request."`.
                const message =
                    // Study: Evaluate `error.issues[0]?.message || "Invalid request."`.
                    error.issues[0]?.message || "Invalid request.";

                // Study: Pass the error to the next Express error handler.
                next(new BadRequestError(message));
                // Study: Exit the function here.
                return;
            // Study: Close the code block.
            }

            // Study: Pass the error to the next Express error handler.
            next(error);
        // Study: Close the code block.
        }
    // Study: Close the code block.
    };
// Study: Close the code block.
};
