// Study: Read and write database records through Prisma for the module/action permission catalog.
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";
// Study: Import `{ PermissionResponse }` from `"./permission.types"`.
import { PermissionResponse } from "./permission.types";

// Study: Export `getAllPermissions` as an async function that returns a promise.
export const getAllPermissions = async (): Promise<PermissionResponse[]> => {
    // Study: Return `prisma.permission.findMany({ select: { id: true, module: true, action: true, descri…` to the caller.
    return prisma.permission.findMany({
        // Study: Choose which fields Prisma returns.
        select: {
            // Study: Set `id` to `true`.
            id: true,
            // Study: Set `module` to `true`.
            module: true,
            // Study: Set `action` to `true`.
            action: true,
            // Study: Set `description` to `true`.
            description: true,
        // Study: Close the object literal.
        },
        // Study: Set the sort order for the returned records.
        orderBy: [
            // Study: Start the object passed to the surrounding expression.
            { module: "asc" },
            // Study: Start the object passed to the surrounding expression.
            { action: "asc" },
        // Study: Close the array literal.
        ],
    // Study: Close the object literal.
    });
// Study: Close the code block.
};
