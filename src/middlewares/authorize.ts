import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/ForbiddenError";
import { Module, Action } from "@prisma/client";
import prisma from "../lib/prisma";

export const authorize = (module: Module, action: Action) => {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const user = req.user!;

            if (user.systemRole === "SUPER_ADMIN") {
                return next();
            }

            if (!user.organizationId || !user.organizationRole?.id) {
                throw new ForbiddenError(
                    "You are not assigned a role in an organization."
                );
            }

            const hasPermission = await prisma.rolePermission.findFirst({
                where: {
                    organizationRoleId: user.organizationRole.id,
                    organizationRole: {
                        organizationId: user.organizationId,
                    },
                    permission: {
                        module,
                        action,
                    },
                },
                select: { id: true },
            });

            if (!hasPermission) {
                throw new ForbiddenError(
                    "You do not have permission to perform this action."
                );
            }

            next();
        } catch (error) {
            next(error);
        }
    };
};
