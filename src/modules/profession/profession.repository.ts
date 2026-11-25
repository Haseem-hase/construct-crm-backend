// Study: This file is about the list of trades workers can be recorded under. Finds or saves information in the database, where the CRM keeps its records.
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";

// Study: Make `getProfessions` available to other files. Its result arrives after its work finishes.
export const getProfessions = async () => {
    // Study: Give `await prisma.profession.findMany({ where: { isActive: true, }, select: { id: true, …` back to the code that asked for it.
    return await prisma.profession.findMany({
        // Study: Set the conditions that records must meet using isActive.
        where: {
            // Study: Set `isActive` to `true`.
            isActive: true,
        // Study: End this group of values.
        },
        // Study: Choose which details the database gives back.
        select: {
            // Study: Set `id` to `true`.
            id: true,
            // Study: Set `name` to `true`.
            name: true,
            // Study: Set `description` to `true`.
            description: true,
            // Study: Set `isActive` to `true`.
            isActive: true,
        // Study: End this group of values.
        },
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `name` to `"asc"`.
            name: "asc",
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};
