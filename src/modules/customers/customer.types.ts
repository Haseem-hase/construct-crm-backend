// Study: This file is about customer accounts and which customers belong under a parent customer. Lists the names and kinds of information this part of the code expects.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";

// Study: Bring in `{ createCustomerSchema, updateCustomerSchema, }` from `"./customer.validation"` so this file can use it.
import {
    // Study: Make `createCustomerSchema` from the other file available here.
    createCustomerSchema,
    // Study: Make `updateCustomerSchema` from the other file available here.
    updateCustomerSchema,
// Study: Finish this group and continue the surrounding step.
} from "./customer.validation";


// Study: Derive the expected information for `CreateCustomerInput` from the same rules that check submitted values.
export type CreateCustomerInput = z.infer<
    // Study: Supply `createCustomerSchema` to the surrounding statement.
    typeof createCustomerSchema
// Study: End the list of details used to describe this kind of information.
>;


// Study: Derive the expected information for `UpdateCustomerInput` from the same rules that check submitted values.
export type UpdateCustomerInput = z.infer<
    // Study: Supply `updateCustomerSchema` to the surrounding statement.
    typeof updateCustomerSchema
// Study: End the list of details used to describe this kind of information.
>;