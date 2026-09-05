import prisma from "../../lib/prisma";
import { PermissionResponse } from "./permission.types";

export const getAllPermissions = async (): Promise<PermissionResponse[]> => {
    return prisma.permission.findMany({
        select: {
            id: true,
            module: true,
            action: true,
            description: true,
        },
        orderBy: [
            { module: "asc" },
            { action: "asc" },
        ],
    });
};
