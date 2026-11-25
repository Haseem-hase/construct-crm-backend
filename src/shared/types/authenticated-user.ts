// Study: Describe the identity and access data carried by an authenticated request.
// Study: Bring in `{ Prisma }` from `"@prisma/client"` so this file can use it.
import { Prisma } from "@prisma/client";

// Study: Set `authenticatedUserSelect` to `{ id: true, fullName: true, email: true, phone: true, organizationId: true, systemR…`.
export const authenticatedUserSelect = {
    // Study: Set `id` to `true`.
    id: true,
    // Study: Set `fullName` to `true`.
    fullName: true,
    // Study: Set `email` to `true`.
    email: true,
    // Study: Set `phone` to `true`.
    phone: true,
    // Study: Set the organization identifier used for this record or operation using `true`.
    organizationId: true,
    // Study: Set `systemRole` to `true`.
    systemRole: true,
    // Study: Load `organizationRole` and return its selected fields: id, role.
    organizationRole: {
        // Study: Choose which details the database gives back.
        select: {
            // Study: Set `id` to `true`.
            id: true,
            // Study: Load `role` and return its selected fields: id, name.
            role: {
                // Study: Choose which details the database gives back.
                select: {
                    // Study: Set `id` to `true`.
                    id: true,
                    // Study: Set `name` to `true`.
                    name: true,
                // Study: End this group of values.
                },
            // Study: End this group of values.
            },
        // Study: End this group of values.
        },
    // Study: End this group of values.
    },
// Study: Finish this group and continue the surrounding step.
} as const;

// Study: Describe which information `AuthenticatedUser` can contain so TypeScript can catch mistakes while checking the code.
export type AuthenticatedUser = Prisma.UserGetPayload<{
    // Study: Define `select` with type `typeof authenticatedUserSelect`.
    select: typeof authenticatedUserSelect;
// Study: Finish this group and continue the surrounding step.
}>;