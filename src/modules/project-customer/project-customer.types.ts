// Study: This file is about which customers are connected to each job and in what role. Lists the names and kinds of information this part of the code expects.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";
// Study: Bring in `{ createProjectCustomerSchema, updateProjectCustomerSchema, projectIdAndProjectCust…` from `"./project-customer.validation"` so this file can use it.
import {
    // Study: Make `createProjectCustomerSchema` from the other file available here.
    createProjectCustomerSchema,
    // Study: Make `updateProjectCustomerSchema` from the other file available here.
    updateProjectCustomerSchema,
    // Study: Make `projectIdAndProjectCustomerIdParamsSchema` from the other file available here.
    projectIdAndProjectCustomerIdParamsSchema
// Study: Finish this group and continue the surrounding step.
} from "./project-customer.validation";

// Study: Derive the expected information for `CreateProjectCustomerInput` from the same rules that check submitted values.
export type CreateProjectCustomerInput = z.infer<typeof createProjectCustomerSchema>;
// Study: Derive the expected information for `UpdateProjectCustomerInput` from the same rules that check submitted values.
export type UpdateProjectCustomerInput = z.infer<typeof updateProjectCustomerSchema>;
// Study: Derive the expected information for `ProjectIdAndProjectCustomerIdParams` from the same rules that check submitted values.
export type ProjectIdAndProjectCustomerIdParams = z.infer<typeof projectIdAndProjectCustomerIdParamsSchema>;
