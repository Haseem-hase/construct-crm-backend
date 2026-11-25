// Study: Checks who is making the request and makes that identity available to the next step.
// Study: Bring in `{ NextFunction, Request, Response }` from `"express"` so this file can use it.
import { NextFunction, Request, Response } from "express";
// Study: Bring in `{ UnauthorizedError }` from `"../errors/UnauthorizedError"` so this file can use it.
import { UnauthorizedError } from "../errors/UnauthorizedError";
// Study: Bring in `{ verifyAccessToken }` from `"../utils/jwt.utils"` so this file can use it.
import { verifyAccessToken } from "../utils/jwt.utils";
// Study: Bring in `{ findUserById }` from `"../modules/auth/auth.repository"` so this file can use it.
import { findUserById } from "../modules/auth/auth.repository";

// Study: Make `authenticate` available to other files. Its result arrives after its work finishes.
export const authenticate = async (
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
        // Study: Read the sign-in proof sent with the request.
        const authHeader = req.headers.authorization;

        // Study: Do the next step if this check passes: `!authHeader || !authHeader.startsWith("Bearer ")`.
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            // Study: Stop here and report this problem: "Authentication token is missing."
            throw new UnauthorizedError("Authentication token is missing.");
        // Study: End this group of steps.
        }

        // Study: Set `token` to `authHeader.split(" ")[1]`.
        const token = authHeader.split(" ")[1];

        // Study: Check that the pass is genuine and valid, then read the user ID it carries.
        const payload = verifyAccessToken(token);

        // Study: Call `findUserById` and wait for it to finish and store its result in `user`.
        const user = await findUserById(payload.userId);

        // Study: Do the next step if there is no value for `user`.
        if (!user) {
            // Study: Stop here and report this problem: "User not found."
            throw new UnauthorizedError("User not found.");
        // Study: End this group of steps.
        }

        // Study: Attach the account to this request so later steps know who is asking.
        req.user = user;

        // Study: Allow the request to move to its next check or action.
        next();
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Send the problem to the part of the backend that prepares an error reply.
        next(error);
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};