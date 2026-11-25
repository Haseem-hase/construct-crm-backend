// Study: Define TypeScript data contracts for customer accounts and parent-child customer relationships.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";

// Study: Import `{ createCustomerSchema, updateCustomerSchema, }` from `"./customer.validation"`.
import {
    // Study: Bring `createCustomerSchema` into scope from the imported module.
    createCustomerSchema,
    // Study: Bring `updateCustomerSchema` into scope from the imported module.
    updateCustomerSchema,
// Study: Close this group and continue the enclosing expression.
} from "./customer.validation";


// Study: Define the compile-time contract named `CreateCustomerInput` from the Zod schema so the types follow validation.
export type CreateCustomerInput = z.infer<
    // Study: Supply `createCustomerSchema` to the surrounding statement.
    typeof createCustomerSchema
// Study: Close the generic type arguments that determine the resulting TypeScript type.
>;


// Study: Define the compile-time contract named `UpdateCustomerInput` from the Zod schema so the types follow validation.
export type UpdateCustomerInput = z.infer<
    // Study: Supply `updateCustomerSchema` to the surrounding statement.
    typeof updateCustomerSchema
// Study: Close the generic type arguments that determine the resulting TypeScript type.
>;