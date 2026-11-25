// Study: This file is about which workers are assigned to each job. Lists the names and kinds of information this part of the code expects.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";
// Study: Bring in `{ createLabourAssignmentSchema, updateLabourAssignmentSchema, labourAssignmentIdSch…` from `"./labour-assignment.validation"` so this file can use it.
import {
    // Study: Make `createLabourAssignmentSchema` from the other file available here.
    createLabourAssignmentSchema,
    // Study: Make `updateLabourAssignmentSchema` from the other file available here.
    updateLabourAssignmentSchema,
    // Study: Make `labourAssignmentIdSchema` from the other file available here.
    labourAssignmentIdSchema,
// Study: Finish this group and continue the surrounding step.
} from "./labour-assignment.validation";

// Study: Derive the expected information for `CreateLabourAssignmentInput` from the same rules that check submitted values.
export type CreateLabourAssignmentInput = z.infer<typeof createLabourAssignmentSchema>;

// Study: Derive the expected information for `UpdateLabourAssignmentInput` from the same rules that check submitted values.
export type UpdateLabourAssignmentInput = z.infer<typeof updateLabourAssignmentSchema>;

// Study: Derive the expected information for `LabourAssignmentIdParams` from the same rules that check submitted values.
export type LabourAssignmentIdParams = z.infer<typeof labourAssignmentIdSchema>;
