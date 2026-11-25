// Study: Define TypeScript data contracts for relationships between projects and customers.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";
// Study: Import `{ createProjectCustomerSchema, updateProjectCustomerSchema, projectIdAndProjectCust…` from `"./project-customer.validation"`.
import {
    // Study: Bring `createProjectCustomerSchema` into scope from the imported module.
    createProjectCustomerSchema,
    // Study: Bring `updateProjectCustomerSchema` into scope from the imported module.
    updateProjectCustomerSchema,
    // Study: Bring `projectIdAndProjectCustomerIdParamsSchema` into scope from the imported module.
    projectIdAndProjectCustomerIdParamsSchema
// Study: Close this group and continue the enclosing expression.
} from "./project-customer.validation";

// Study: Define the compile-time contract named `CreateProjectCustomerInput` from the Zod schema so the types follow validation.
export type CreateProjectCustomerInput = z.infer<typeof createProjectCustomerSchema>;
// Study: Define the compile-time contract named `UpdateProjectCustomerInput` from the Zod schema so the types follow validation.
export type UpdateProjectCustomerInput = z.infer<typeof updateProjectCustomerSchema>;
// Study: Define the compile-time contract named `ProjectIdAndProjectCustomerIdParams` from the Zod schema so the types follow validation.
export type ProjectIdAndProjectCustomerIdParams = z.infer<typeof projectIdAndProjectCustomerIdParamsSchema>;
