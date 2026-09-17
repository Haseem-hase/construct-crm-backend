import prisma from "../../lib/prisma";

export const getProfessions = async () => {
    return await prisma.profession.findMany({
        where: {
            isActive: true,
        },
        select: {
            id: true,
            name: true,
            description: true,
            isActive: true,
        },
        orderBy: {
            name: "asc",
        },
    });
};
