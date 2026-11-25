// Study: This file is about the list of actions people can be allowed to take. Finds or saves information in the database, where the CRM keeps its records.
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";
// Study: Bring in `{ PermissionResponse }` from `"./permission.types"` so this file can use it.
import { PermissionResponse } from "./permission.types";

// Study: Make `getAllPermissions` available to other files. Its result arrives after its work finishes.
export const getAllPermissions = async (): Promise<PermissionResponse[]> => {
    // Study: Give `prisma.permission.findMany({ select: { id: true, module: true, action: true, descri…` back to the code that asked for it.
    return prisma.permission.findMany({
        // Study: Choose which details the database gives back.
        select: {
            // Study: Set `id` to `true`.
            id: true,
            // Study: Set `module` to `true`.
            module: true,
            // Study: Set `action` to `true`.
            action: true,
            // Study: Set `description` to `true`.
            description: true,
        // Study: End this group of values.
        },
        // Study: Set the sort order for the returned records.
        orderBy: [
            // Study: Start the object passed to the surrounding expression.
            { module: "asc" },
            // Study: Start the object passed to the surrounding expression.
            { action: "asc" },
        // Study: End this group of values.
        ],
    // Study: End this group of values.
    });
// Study: End this group of steps.
};
