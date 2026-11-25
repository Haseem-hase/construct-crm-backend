// Study: Read and write database records through Prisma for the contractor responsibility catalog.
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";

// Study: Export `getActiveResponsibilities` as an async function that returns a promise.
export const getActiveResponsibilities = async () => {
    // Study: Return `await prisma.responsibility.findMany({ where: { isActive: true, }, orderBy: { name:…` to the caller.
    return await prisma.responsibility.findMany({
        // Study: Set the conditions that database records must match using isActive.
        where: {
            // Study: Set `isActive` to `true`.
            isActive: true,
        // Study: Close the object literal.
        },
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `name` to `"asc"`.
            name: "asc",
        // Study: Close the object literal.
        },
        // Study: Choose which fields Prisma returns.
        select: {
            // Study: Set `id` to `true`.
            id: true,
            // Study: Set `name` to `true`.
            name: true,
            // Study: Set `description` to `true`.
            description: true,
            // Study: Set `isActive` to `true`.
            isActive: true,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};
