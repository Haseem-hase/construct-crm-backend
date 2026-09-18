import prisma from "../../lib/prisma";

export const getActiveResponsibilities = async () => {
    return await prisma.responsibility.findMany({
        where: {
            isActive: true,
        },
        orderBy: {
            name: "asc",
        },
        select: {
            id: true,
            name: true,
            description: true,
            isActive: true,
        },
    });
};
