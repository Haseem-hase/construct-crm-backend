// Study: This file is about the people you can contact at a customer account. Lists the names and kinds of information this part of the code expects.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";
// Study: Bring in `{ createCustomerContactSchema, updateCustomerContactSchema, contactIdSchema, custom…` from `"./customer-contact.validation"` so this file can use it.
import {
    // Study: Make `createCustomerContactSchema` from the other file available here.
    createCustomerContactSchema,
    // Study: Make `updateCustomerContactSchema` from the other file available here.
    updateCustomerContactSchema,
    // Study: Make `contactIdSchema` from the other file available here.
    contactIdSchema,
    // Study: Make `customerAndContactIdParamsSchema` from the other file available here.
    customerAndContactIdParamsSchema,
// Study: Finish this group and continue the surrounding step.
} from "./customer-contact.validation";

// Study: Derive the expected information for `CreateCustomerContactInput` from the same rules that check submitted values.
export type CreateCustomerContactInput = z.infer<typeof createCustomerContactSchema>;

// Study: Derive the expected information for `UpdateCustomerContactInput` from the same rules that check submitted values.
export type UpdateCustomerContactInput = z.infer<typeof updateCustomerContactSchema>;

// Study: Derive the expected information for `ContactIdParams` from the same rules that check submitted values.
export type ContactIdParams = z.infer<typeof contactIdSchema>;

// Study: Derive the expected information for `CustomerAndContactIdParams` from the same rules that check submitted values.
export type CustomerAndContactIdParams = z.infer<typeof customerAndContactIdParamsSchema>;
