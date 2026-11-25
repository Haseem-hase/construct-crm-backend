// Study: Describe the identity and access data carried by an authenticated request.
// Study: Import `{ Prisma }` from `"@prisma/client"`.
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
        // Study: Choose which fields Prisma returns.
        select: {
            // Study: Set `id` to `true`.
            id: true,
            // Study: Load `role` and return its selected fields: id, name.
            role: {
                // Study: Choose which fields Prisma returns.
                select: {
                    // Study: Set `id` to `true`.
                    id: true,
                    // Study: Set `name` to `true`.
                    name: true,
                // Study: Close the object literal.
                },
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    },
// Study: Close this group and continue the enclosing expression.
} as const;

// Study: Define the compile-time contract named `AuthenticatedUser`.
export type AuthenticatedUser = Prisma.UserGetPayload<{
    // Study: Define `select` with type `typeof authenticatedUserSelect`.
    select: typeof authenticatedUserSelect;
// Study: Close this group and continue the enclosing expression.
}>;