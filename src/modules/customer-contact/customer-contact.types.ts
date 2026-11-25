// Study: Define TypeScript data contracts for contacts attached to customer accounts.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";
// Study: Import `{ createCustomerContactSchema, updateCustomerContactSchema, contactIdSchema, custom…` from `"./customer-contact.validation"`.
import {
    // Study: Bring `createCustomerContactSchema` into scope from the imported module.
    createCustomerContactSchema,
    // Study: Bring `updateCustomerContactSchema` into scope from the imported module.
    updateCustomerContactSchema,
    // Study: Bring `contactIdSchema` into scope from the imported module.
    contactIdSchema,
    // Study: Bring `customerAndContactIdParamsSchema` into scope from the imported module.
    customerAndContactIdParamsSchema,
// Study: Close this group and continue the enclosing expression.
} from "./customer-contact.validation";

// Study: Define the compile-time contract named `CreateCustomerContactInput` from the Zod schema so the types follow validation.
export type CreateCustomerContactInput = z.infer<typeof createCustomerContactSchema>;

// Study: Define the compile-time contract named `UpdateCustomerContactInput` from the Zod schema so the types follow validation.
export type UpdateCustomerContactInput = z.infer<typeof updateCustomerContactSchema>;

// Study: Define the compile-time contract named `ContactIdParams` from the Zod schema so the types follow validation.
export type ContactIdParams = z.infer<typeof contactIdSchema>;

// Study: Define the compile-time contract named `CustomerAndContactIdParams` from the Zod schema so the types follow validation.
export type CustomerAndContactIdParams = z.infer<typeof customerAndContactIdParamsSchema>;
