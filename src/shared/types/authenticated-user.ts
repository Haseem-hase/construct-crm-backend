import { Prisma } from "@prisma/client";

export const authenticatedUserSelect = {
    id: true,
    fullName: true,
    email: true,
    phone: true,
    organizationId: true,
    systemRole: true,
    organizationRole: {
        select: {
            id: true,
            role: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    },
} as const;

export type AuthenticatedUser = Prisma.UserGetPayload<{
    select: typeof authenticatedUserSelect;
}>;