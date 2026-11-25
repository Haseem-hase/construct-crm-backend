// Study: Translate HTTP requests into service calls and send HTTP responses for account registration, sign-in, sign-out, and session token refresh.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";
// Study: Import `* as authService` from `"./auth.service"`.
import * as authService from "./auth.service";

//register
// Study: Export `registerCustomer` as an async function that returns a promise.
export const registerCustomer = async (
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
        // Study: Call `authService.registerCustomer` and wait for it to finish and store its result in `result`.
        const result = await authService.registerCustomer(req.body);

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Customer registered successfully."`.
            message: "Customer registered successfully.",
            // Study: Set `data` to `result`.
            data: result
        // Study: Close the object literal.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

//login
// Study: Export `login` as an async function that returns a promise.
export const login = async (
    // Study: Accept `req` with type `Request`.
    req: Request,
    // Study: Accept `res` with type `Response`.
    res: Response,
    // Study: Accept `next` with type `NextFunction`.
    next: NextFunction
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run this block and handle failures in the associated catch block.
    try{
        // Study: Call `authService.login` and wait for it to finish and store its result in `result`.
        const result = await authService.login(req.body);

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Logged in successfully."`.
            message: "Logged in successfully.",
            // Study: Set `data` to `result`.
            data: result,
        // Study: Close the object literal.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

//get me
// Study: Export `getMe` as an async function that returns a promise.
export const getMe = async (
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
        // Study: Call `authService.getMe` and wait for it to finish and store its result in `result`.
        const result = await authService.getMe(req.user!);

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"User profile retrieved successfully."`.
            message: "User profile retrieved successfully.",
            // Study: Set `data` to `result`.
            data: result,
        // Study: Close the object literal.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
}

//post refresh token logic
// Study: Export `refreshAccessToken` as an async function that returns a promise.
export const refreshAccessToken = async (
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
        // Study: Call `authService.refreshAccessToken` and wait for it to finish and store its result in `result`.
        const result = await authService.refreshAccessToken(
            // Study: Supply `req` to the surrounding statement.
            req.body.refreshToken
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Tokens refreshed successfully."`.
            message: "Tokens refreshed successfully.",
            // Study: Set `data` to `result`.
            data: result
        // Study: Close the object literal.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};

//logout
// Study: Export `logout` as an async function that returns a promise.
export const logout = async (
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
        // Study: Call `authService.logout` and wait for it to finish.
        await authService.logout(
            // Study: Supply `req` to the surrounding statement.
            req.body.refreshToken
        // Study: Close the call arguments.
        );

        // Study: Send a JSON response to the client.
        res.status(200).json({
            // Study: Set `success` to `true`.
            success: true,
            // Study: Set `message` to `"Logged out successfully."`.
            message: "Logged out successfully."
        // Study: Close the object literal.
        });
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Pass the error to the next Express error handler.
        next(error);
    // Study: Close the code block.
    }
// Study: Close the code block.
};