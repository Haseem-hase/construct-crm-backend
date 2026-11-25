// Study: Define TypeScript data contracts for contractor records.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";

// Study: Import `{ createContractorSchema, updateContractorSchema, contractorIdSchema, }` from `"./contractor.validation"`.
import {
    // Study: Bring `createContractorSchema` into scope from the imported module.
    createContractorSchema,
    // Study: Bring `updateContractorSchema` into scope from the imported module.
    updateContractorSchema,
    // Study: Bring `contractorIdSchema` into scope from the imported module.
    contractorIdSchema,
// Study: Close this group and continue the enclosing expression.
} from "./contractor.validation";

// Study: Define the compile-time contract named `CreateContractorInput` from the Zod schema so the types follow validation.
export type CreateContractorInput = z.infer<
    // Study: Supply `createContractorSchema` to the surrounding statement.
    typeof createContractorSchema
// Study: Close the generic type arguments that determine the resulting TypeScript type.
>;

// Study: Define the compile-time contract named `UpdateContractorInput` from the Zod schema so the types follow validation.
export type UpdateContractorInput = z.infer<
    // Study: Supply `updateContractorSchema` to the surrounding statement.
    typeof updateContractorSchema
// Study: Close the generic type arguments that determine the resulting TypeScript type.
>;

// Study: Define the compile-time contract named `ContractorIdParams` from the Zod schema so the types follow validation.
export type ContractorIdParams = z.infer<
    // Study: Supply `contractorIdSchema` to the surrounding statement.
    typeof contractorIdSchema
// Study: Close the generic type arguments that determine the resulting TypeScript type.
>;
