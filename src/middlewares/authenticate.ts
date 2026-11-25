// Study: Read and verify credentials and attach the authenticated user to the request.
// Study: Import `{ NextFunction, Request, Response }` from `"express"`.
import { NextFunction, Request, Response } from "express";
// Study: Import `{ UnauthorizedError }` from `"../errors/UnauthorizedError"`.
import { UnauthorizedError } from "../errors/UnauthorizedError";
// Study: Import `{ verifyAccessToken }` from `"../utils/jwt.utils"`.
import { verifyAccessToken } from "../utils/jwt.utils";
// Study: Import `{ findUserById }` from `"../modules/auth/auth.repository"`.
import { findUserById } from "../modules/auth/auth.repository";

// Study: Export `authenticate` as an async function that returns a promise.
export const authenticate = async (
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
        // Study: Set `authHeader` to `req.headers.authorization`.
        const authHeader = req.headers.authorization;

        // Study: Run the following branch when `!authHeader || !authHeader.startsWith("Bearer ")` is truthy.
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            // Study: Stop this execution path by throwing `new UnauthorizedError("Authentication token is missing.")`.
            throw new UnauthorizedError("Authentication token is missing.");
        // Study: Close the code block.
        }

        // Study: Set `token` to `authHeader.split(" ")[1]`.
        const token = authHeader.split(" ")[1];

        // Study: Call `verifyAccessToken` and store the result as `payload`.
        const payload = verifyAccessToken(token);

        // Study: Call `findUserById` and wait for it to finish and store its result in `user`.
        const user = await findUserById(payload.userId);

        // Study: Run the following branch when `!user` is truthy.
        if (!user) {
            // Study: Stop this execution path by throwing `new UnauthorizedError("User not found.")`.
            throw new UnauthorizedError("User not found.");
        // Study: Close the code block.
        }

        // Study: Assign `user` to `req.user`.
        req.user = user;

        // Study: Continue to the next Express middleware or handler.
        next();
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};