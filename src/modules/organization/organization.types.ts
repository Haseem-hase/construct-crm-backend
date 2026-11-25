// Study: This file is about the companies using the CRM and the people who own their accounts. Lists the names and kinds of information this part of the code expects.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";
// Study: Bring in `{ createOrganizationSchema, listOrganizationsQuerySchema, registerOrganizationSchem…` from `"./organization.validation"` so this file can use it.
import {
    // Study: Make `createOrganizationSchema` from the other file available here.
    createOrganizationSchema,
    // Study: Make `listOrganizationsQuerySchema` from the other file available here.
    listOrganizationsQuerySchema,
    // Study: Make `registerOrganizationSchema` from the other file available here.
    registerOrganizationSchema,
// Study: Finish this group and continue the surrounding step.
} from "./organization.validation";

// Study: Derive the expected information for `RegisterOrganizationInput` from the same rules that check submitted values.
export type RegisterOrganizationInput = z.infer<
    // Study: Supply `registerOrganizationSchema` to the surrounding statement.
    typeof registerOrganizationSchema
// Study: End the list of details used to describe this kind of information.
>;

// Study: Derive the expected information for `CreateOrganizationRequest` from the same rules that check submitted values.
export type CreateOrganizationRequest = z.infer<typeof createOrganizationSchema>;
// Study: Derive the expected information for `ListOrganizationsQuery` from the same rules that check submitted values.
export type ListOrganizationsQuery = z.infer<typeof listOrganizationsQuerySchema>;

// Study: Describe which information `CreateOrganizationInput` can contain so TypeScript can catch mistakes while checking the code.
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
