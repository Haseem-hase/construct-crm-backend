// Study: Define TypeScript data contracts for worker records and their professions.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";

// Study: Import `{ createLabourSchema, updateLabourSchema, labourIdSchema, }` from `"./labour.validation"`.
import {
    // Study: Bring `createLabourSchema` into scope from the imported module.
    createLabourSchema,
    // Study: Bring `updateLabourSchema` into scope from the imported module.
    updateLabourSchema,
    // Study: Bring `labourIdSchema` into scope from the imported module.
    labourIdSchema,
// Study: Close this group and continue the enclosing expression.
} from "./labour.validation";

// Study: Define the compile-time contract named `CreateLabourInput` from the Zod schema so the types follow validation.
export type CreateLabourInput = z.infer<
    // Study: Supply `createLabourSchema` to the surrounding statement.
    typeof createLabourSchema
// Study: Close the generic type arguments that determine the resulting TypeScript type.
>;

// Study: Define the compile-time contract named `UpdateLabourInput` from the Zod schema so the types follow validation.
export type UpdateLabourInput = z.infer<
    // Study: Supply `updateLabourSchema` to the surrounding statement.
    typeof updateLabourSchema
// Study: Close the generic type arguments that determine the resulting TypeScript type.
>;

// Study: Define the compile-time contract named `LabourIdParams` from the Zod schema so the types follow validation.
export type LabourIdParams = z.infer<
    // Study: Supply `labourIdSchema` to the surrounding statement.
    typeof labourIdSchema
// Study: Close the generic type arguments that determine the resulting TypeScript type.
>;
