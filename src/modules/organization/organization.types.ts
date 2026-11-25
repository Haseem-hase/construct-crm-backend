// Study: Define TypeScript data contracts for organizations and their owners.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";
// Study: Import `{ createOrganizationSchema, listOrganizationsQuerySchema, registerOrganizationSchem…` from `"./organization.validation"`.
import {
    // Study: Bring `createOrganizationSchema` into scope from the imported module.
    createOrganizationSchema,
    // Study: Bring `listOrganizationsQuerySchema` into scope from the imported module.
    listOrganizationsQuerySchema,
    // Study: Bring `registerOrganizationSchema` into scope from the imported module.
    registerOrganizationSchema,
// Study: Close this group and continue the enclosing expression.
} from "./organization.validation";

// Study: Define the compile-time contract named `RegisterOrganizationInput` from the Zod schema so the types follow validation.
export type RegisterOrganizationInput = z.infer<
    // Study: Supply `registerOrganizationSchema` to the surrounding statement.
    typeof registerOrganizationSchema
// Study: Close the generic type arguments that determine the resulting TypeScript type.
>;

// Study: Define the compile-time contract named `CreateOrganizationRequest` from the Zod schema so the types follow validation.
export type CreateOrganizationRequest = z.infer<typeof createOrganizationSchema>;
// Study: Define the compile-time contract named `ListOrganizationsQuery` from the Zod schema so the types follow validation.
export type ListOrganizationsQuery = z.infer<typeof listOrganizationsQuerySchema>;

// Study: Define the compile-time contract named `CreateOrganizationInput`.
export interface CreateOrganizationInput {
    // Study: Define `organizationName` with type `string`.
    organizationName: string;
    // Study: Define `description` as optional with type `string`.
    description?: string;

    // Study: Define `fullName` with type `string`.
    fullName: string;
    // Study: Define `email` with type `string`.
    email: string;
    // Study: Define `phone` with type `string`.
    phone: string;
    // Study: Define `password` with type `string`.
    password: string;

    // Study: Define `roleId` with type `string`.
    roleId: string;
// Study: Close the interface declaration.
}
