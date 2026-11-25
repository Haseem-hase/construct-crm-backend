// Study: Define TypeScript data contracts for worker placements on construction projects.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";
// Study: Import `{ createLabourAssignmentSchema, updateLabourAssignmentSchema, labourAssignmentIdSch…` from `"./labour-assignment.validation"`.
import {
    // Study: Bring `createLabourAssignmentSchema` into scope from the imported module.
    createLabourAssignmentSchema,
    // Study: Bring `updateLabourAssignmentSchema` into scope from the imported module.
    updateLabourAssignmentSchema,
    // Study: Bring `labourAssignmentIdSchema` into scope from the imported module.
    labourAssignmentIdSchema,
// Study: Close this group and continue the enclosing expression.
} from "./labour-assignment.validation";

// Study: Define the compile-time contract named `CreateLabourAssignmentInput` from the Zod schema so the types follow validation.
export type CreateLabourAssignmentInput = z.infer<typeof createLabourAssignmentSchema>;

// Study: Define the compile-time contract named `UpdateLabourAssignmentInput` from the Zod schema so the types follow validation.
export type UpdateLabourAssignmentInput = z.infer<typeof updateLabourAssignmentSchema>;

// Study: Define the compile-time contract named `LabourAssignmentIdParams` from the Zod schema so the types follow validation.
export type LabourAssignmentIdParams = z.infer<typeof labourAssignmentIdSchema>;
