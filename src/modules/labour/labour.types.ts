// Study: This file is about workers and the kinds of work they do. Lists the names and kinds of information this part of the code expects.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";

// Study: Bring in `{ createLabourSchema, updateLabourSchema, labourIdSchema, }` from `"./labour.validation"` so this file can use it.
import {
    // Study: Make `createLabourSchema` from the other file available here.
    createLabourSchema,
    // Study: Make `updateLabourSchema` from the other file available here.
    updateLabourSchema,
    // Study: Make `labourIdSchema` from the other file available here.
    labourIdSchema,
// Study: Finish this group and continue the surrounding step.
} from "./labour.validation";

// Study: Derive the expected information for `CreateLabourInput` from the same rules that check submitted values.
export type CreateLabourInput = z.infer<
    // Study: Supply `createLabourSchema` to the surrounding statement.
    typeof createLabourSchema
// Study: End the list of details used to describe this kind of information.
>;

// Study: Derive the expected information for `UpdateLabourInput` from the same rules that check submitted values.
export type UpdateLabourInput = z.infer<
    // Study: Supply `updateLabourSchema` to the surrounding statement.
    typeof updateLabourSchema
// Study: End the list of details used to describe this kind of information.
>;

// Study: Derive the expected information for `LabourIdParams` from the same rules that check submitted values.
export type LabourIdParams = z.infer<
    // Study: Supply `labourIdSchema` to the surrounding statement.
    typeof labourIdSchema
// Study: End the list of details used to describe this kind of information.
>;
