// Study: Check whether the authenticated user can perform a module action.
// Study: Import `{ Request, Response, NextFunction }` from `"express"`.
import { Request, Response, NextFunction } from "express";
// Study: Import `{ ForbiddenError }` from `"../errors/ForbiddenError"`.
import { ForbiddenError } from "../errors/ForbiddenError";
// Study: Import `{ Module, Action }` from `"@prisma/client"`.
import { Module, Action } from "@prisma/client";
// Study: Import `prisma` from `"../lib/prisma"`.
import prisma from "../lib/prisma";

// Study: Export `authorize` as a reusable function.
export const authorize = (module: Module, action: Action) => {
    // Study: Return `async ( req: Request, res: Response, next: NextFunction ) => { try { const user = r…` to the caller.
    return async (
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
            // Study: Set `user` to `req.user!`.
            const user = req.user!;

            // Study: Run the following branch when `user.systemRole === "SUPER_ADMIN"` is truthy.
            if (user.systemRole === "SUPER_ADMIN") {
                // Study: Return `next()` to the caller.
                return next();
            // Study: Close the code block.
            }

            // Study: Run the following branch when `!user.organizationId || !user.organizationRole?.id` is truthy.
            if (!user.organizationId || !user.organizationRole?.id) {
                // Study: Stop this execution path by throwing `new ForbiddenError( "You are not assigned a role in an organization." )`.
                throw new ForbiddenError(
                    // Study: Supply the literal string `"You are not assigned a role in an organization."` here.
                    "You are not assigned a role in an organization."
                // Study: Close the current group.
                );
            // Study: Close the code block.
            }

            // Study: Run the following branch when `user.organizationRole.role.name === "ORGANIZATION_OWNER"` is truthy.
            if (user.organizationRole.role.name === "ORGANIZATION_OWNER") {
                // Study: Return `next()` to the caller.
                return next();
            // Study: Close the code block.
            }

            // Study: Fetch the first record that matches the filters through `prisma.rolePermission` and wait for it to finish and store its result in `hasPermission`.
            const hasPermission = await prisma.rolePermission.findFirst({
                // Study: Set the conditions that database records must match using organizationRoleId, organizationRole, permission.
                where: {
                    // Study: Set `organizationRoleId` to `user.organizationRole.id`.
                    organizationRoleId: user.organizationRole.id,
                    // Study: Start the nested value for `organizationRole`.
                    organizationRole: {
                        // Study: Set the organization identifier used for this record or operation using `user.organizationId`.
                        organizationId: user.organizationId,
                    // Study: Close the object literal.
                    },
                    // Study: Start the nested value for `permission`.
                    permission: {
                        // Study: Pass the current `module` value under the same property name.
                        module,
                        // Study: Pass the current `action` value under the same property name.
                        action,
                    // Study: Close the object literal.
                    },
                // Study: Close the object literal.
                },
                // Study: Choose which fields Prisma returns.
                select: { id: true },
            // Study: Close the object literal.
            });

            // Study: Run the following branch when `!hasPermission` is truthy.
            if (!hasPermission) {
                // Study: Stop this execution path by throwing `new ForbiddenError( "You do not have permission to perform this action." )`.
                throw new ForbiddenError(
                    // Study: Supply the literal string `"You do not have permission to perform this action."` here.
                    "You do not have permission to perform this action."
                // Study: Close the current group.
                );
            // Study: Close the code block.
            }

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
// Study: Close the code block.
};
