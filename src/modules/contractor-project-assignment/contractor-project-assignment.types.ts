// Study: This file is about which contractors work on which jobs and what they are responsible for. Lists the names and kinds of information this part of the code expects.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";
// Study: Bring in `{ createContractorProjectAssignmentSchema, updateContractorProjectAssignmentSchema }` from `"./contractor-project-assignment.validation"` so this file can use it.
import { 
    // Study: Make `createContractorProjectAssignmentSchema` from the other file available here.
    createContractorProjectAssignmentSchema,
    // Study: Make `updateContractorProjectAssignmentSchema` from the other file available here.
    updateContractorProjectAssignmentSchema 
// Study: Finish this group and continue the surrounding step.
} from "./contractor-project-assignment.validation";

// Study: Derive the expected information for `CreateContractorProjectAssignmentBody` from the same rules that check submitted values.
export type CreateContractorProjectAssignmentBody = z.infer<typeof createContractorProjectAssignmentSchema>;

// Study: Derive the expected information for `UpdateContractorProjectAssignmentBody` from the same rules that check submitted values.
export type UpdateContractorProjectAssignmentBody = z.infer<typeof updateContractorProjectAssignmentSchema>;
