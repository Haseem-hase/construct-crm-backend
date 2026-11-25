// Study: Checks whether the signed-in person is allowed to take the requested action.
// Study: Bring in `{ Request, Response, NextFunction }` from `"express"` so this file can use it.
import { Request, Response, NextFunction } from "express";
// Study: Bring in `{ ForbiddenError }` from `"../errors/ForbiddenError"` so this file can use it.
import { ForbiddenError } from "../errors/ForbiddenError";
// Study: Bring in `{ Module, Action }` from `"@prisma/client"` so this file can use it.
import { Module, Action } from "@prisma/client";
// Study: Bring in `prisma` from `"../lib/prisma"` so this file can use it.
import prisma from "../lib/prisma";

// Study: Set up a reusable step named `authorize`.
export const authorize = (module: Module, action: Action) => {
    // Study: Give `async ( req: Request, res: Response, next: NextFunction ) => { try { const user = r…` back to the code that asked for it.
    return async (
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
            // Study: Set `user` to `req.user!`.
            const user = req.user!;

            // Study: Do the next step if this check passes: `user.systemRole === "SUPER_ADMIN"`.
            if (user.systemRole === "SUPER_ADMIN") {
                // Study: Give `next()` back to the code that asked for it.
                return next();
            // Study: End this group of steps.
            }

            // Study: Do the next step if this check passes: `!user.organizationId || !user.organizationRole?.id`.
            if (!user.organizationId || !user.organizationRole?.id) {
                // Study: Stop here and pass the problem onward: `new ForbiddenError( "You are not assigned a role in an organization." )`.
                throw new ForbiddenError(
                    // Study: Supply the literal string `"You are not assigned a role in an organization."` here.
                    "You are not assigned a role in an organization."
                // Study: Close the current group.
                );
            // Study: End this group of steps.
            }

            // Study: Do the next step if this check passes: `user.organizationRole.role.name === "ORGANIZATION_OWNER"`.
            if (user.organizationRole.role.name === "ORGANIZATION_OWNER") {
                // Study: Give `next()` back to the code that asked for it.
                return next();
            // Study: End this group of steps.
            }

            // Study: Find the first record that meets these checks using `prisma.rolePermission` and wait for it to finish and store its result in `hasPermission`.
            const hasPermission = await prisma.rolePermission.findFirst({
                // Study: Set the conditions that records must meet using organizationRoleId, organizationRole, permission.
                where: {
                    // Study: Set `organizationRoleId` to `user.organizationRole.id`.
                    organizationRoleId: user.organizationRole.id,
                    // Study: Start the nested value for `organizationRole`.
                    organizationRole: {
                        // Study: Set the organization identifier used for this record or operation using `user.organizationId`.
                        organizationId: user.organizationId,
                    // Study: End this group of values.
                    },
                    // Study: Start the nested value for `permission`.
                    permission: {
                        // Study: Carry the value of `module` into the new group under the same name.
                        module,
                        // Study: Carry the value of `action` into the new group under the same name.
                        action,
                    // Study: End this group of values.
                    },
                // Study: End this group of values.
                },
                // Study: Choose which details the database gives back.
                select: { id: true },
            // Study: End this group of values.
            });

            // Study: Do the next step if there is no value for `hasPermission`.
            if (!hasPermission) {
                // Study: Stop here and pass the problem onward: `new ForbiddenError( "You do not have permission to perform this action." )`.
                throw new ForbiddenError(
                    // Study: Supply the literal string `"You do not have permission to perform this action."` here.
                    "You do not have permission to perform this action."
                // Study: Close the current group.
                );
            // Study: End this group of steps.
            }

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
// Study: End this group of steps.
};
