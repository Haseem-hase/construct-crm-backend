import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { verifyAccessToken } from "../utils/jwt.utils";

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedError("Authentication token is missing.");
        }

        const token = authHeader.split(" ")[1];

        const payload = verifyAccessToken(token);

        req.user = payload;

        next();
    } catch (error) {
        next(error);
    }
};