// Study: Checks the information sent by the screen before passing it to the part that does the work.
// Study: Bring in `{ Request, Response, NextFunction }` from `"express"` so this file can use it.
import { Request, Response, NextFunction } from "express";
// Study: Bring in `{ ZodError, ZodSchema }` from `"zod"` so this file can use it.
import { ZodError, ZodSchema } from "zod";
// Study: Bring in `{ BadRequestError }` from `"../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../errors/BadRequestError";

// Study: Describe which information `ValidationSource` can contain so TypeScript can catch mistakes while checking the code.
type ValidationSource = "body" | "params" | "query";

// Study: Set up a reusable step named `validate`.
export const validate = (
    // Study: This step receives `schema`. `ZodSchema` describes what that information should look like.
    schema: ZodSchema,
    // Study: This step receives `source`. `ValidationSource` with initial value `"body"` describes what that information should look like.
    source: ValidationSource = "body"
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `( req: Request, res: Response, next: NextFunction ) => { try { const validatedData …` back to the code that asked for it.
    return (
        // Study: Read the information that came in with the request from the screen.
        req: Request,
        // Study: Use this to send information or an error back to the screen.
        res: Response,
        // Study: Use this to move the request to the next check or action.
        next: NextFunction
    // Study: Finish this group and continue the surrounding step.
    ) => {
        // Study: Try these steps. If one fails, go to the error-handling steps below.
        try {
            // Study: Check `req[source]` using the rule `schema` and obtain the parsed value and store the result as `validatedData`.
            const validatedData = schema.parse(req[source]);

            // Express 5 exposes req.query through a getter, so keep parsed
            // query values in res.locals instead of assigning to req.query.
            // Study: Do the next step if this check passes: `source === "query"`.
            if (source === "query") {
                // Study: Assign `validatedData` to `res.locals.validatedQuery`.
                res.locals.validatedQuery = validatedData;
            // Study: Run this branch if the preceding conditions failed.
            } else {
                // Study: Assign `validatedData` to `req[source]`.
                req[source] = validatedData;
            // Study: End this group of steps.
            }

            // Study: Allow the request to move to its next check or action.
            next();
        // Study: Handle a problem raised during the steps above.
        } catch (error) {
            // Study: Do the next step if this check passes: `error instanceof ZodError`.
            if (error instanceof ZodError) {
                // Study: Set `message` to `error.issues[0]?.message || "Invalid request."`.
                const message =
                    // Study: Evaluate `error.issues[0]?.message || "Invalid request."`.
                    error.issues[0]?.message || "Invalid request.";

                // Study: Send the problem to the part of the backend that prepares an error reply.
                next(new BadRequestError(message));
                // Study: Exit the function here.
                return;
            // Study: End this group of steps.
            }

            // Study: Send the problem to the part of the backend that prepares an error reply.
            next(error);
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    };
// Study: End this group of steps.
};
