import { Prisma } from "@prisma/client";

export const authenticatedUserSelect = {
    id: true,
    fullName: true,
    email: true,
    phone: true,
    role: {
        select: {
            id: true,
            name: true,
        },
    },
} as const;

export type AuthenticatedUser = Prisma.UserGetPayload<{
    select: typeof authenticatedUserSelect;
}>;