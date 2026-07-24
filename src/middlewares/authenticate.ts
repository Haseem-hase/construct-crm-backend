import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { verifyAccessToken } from "../utils/jwt.utils";
import { findUserById } from "../modules/auth/auth.repository";

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("Authentication token is missing.");
        }

        const token = authHeader.split(" ")[1];

        const payload = verifyAccessToken(token);

        const user = await findUserById(payload.userId);

        if (!user) {
            throw new UnauthorizedError("User not found.");
        }

        req.user = user;

        next();
    } catch (error) {
        next(error);
    }
};