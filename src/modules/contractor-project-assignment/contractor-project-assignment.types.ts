// Study: Define TypeScript data contracts for contractor placements on projects and their responsibilities.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";
// Study: Import `{ createContractorProjectAssignmentSchema, updateContractorProjectAssignmentSchema }` from `"./contractor-project-assignment.validation"`.
import { 
    // Study: Bring `createContractorProjectAssignmentSchema` into scope from the imported module.
    createContractorProjectAssignmentSchema,
    // Study: Bring `updateContractorProjectAssignmentSchema` into scope from the imported module.
    updateContractorProjectAssignmentSchema 
// Study: Close this group and continue the enclosing expression.
} from "./contractor-project-assignment.validation";

// Study: Define the compile-time contract named `CreateContractorProjectAssignmentBody` from the Zod schema so the types follow validation.
export type CreateContractorProjectAssignmentBody = z.infer<typeof createContractorProjectAssignmentSchema>;

// Study: Define the compile-time contract named `UpdateContractorProjectAssignmentBody` from the Zod schema so the types follow validation.
export type UpdateContractorProjectAssignmentBody = z.infer<typeof updateContractorProjectAssignmentSchema>;
