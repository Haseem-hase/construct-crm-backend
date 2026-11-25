// Study: Read and write database records through Prisma for the worker profession catalog.
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";

// Study: Export `getProfessions` as an async function that returns a promise.
export const getProfessions = async () => {
    // Study: Return `await prisma.profession.findMany({ where: { isActive: true, }, select: { id: true, …` to the caller.
    return await prisma.profession.findMany({
        // Study: Set the conditions that database records must match using isActive.
        where: {
            // Study: Set `isActive` to `true`.
            isActive: true,
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
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `name` to `"asc"`.
            name: "asc",
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};
