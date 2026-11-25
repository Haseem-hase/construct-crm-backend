// Study: This file is about the details the CRM keeps about contractors. Lists the names and kinds of information this part of the code expects.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";

// Study: Bring in `{ createContractorSchema, updateContractorSchema, contractorIdSchema, }` from `"./contractor.validation"` so this file can use it.
import {
    // Study: Make `createContractorSchema` from the other file available here.
    createContractorSchema,
    // Study: Make `updateContractorSchema` from the other file available here.
    updateContractorSchema,
    // Study: Make `contractorIdSchema` from the other file available here.
    contractorIdSchema,
// Study: Finish this group and continue the surrounding step.
} from "./contractor.validation";

// Study: Derive the expected information for `CreateContractorInput` from the same rules that check submitted values.
export type CreateContractorInput = z.infer<
    // Study: Supply `createContractorSchema` to the surrounding statement.
    typeof createContractorSchema
// Study: End the list of details used to describe this kind of information.
>;

// Study: Derive the expected information for `UpdateContractorInput` from the same rules that check submitted values.
export type UpdateContractorInput = z.infer<
    // Study: Supply `updateContractorSchema` to the surrounding statement.
    typeof updateContractorSchema
// Study: End the list of details used to describe this kind of information.
>;

// Study: Derive the expected information for `ContractorIdParams` from the same rules that check submitted values.
export type ContractorIdParams = z.infer<
    // Study: Supply `contractorIdSchema` to the surrounding statement.
    typeof contractorIdSchema
// Study: End the list of details used to describe this kind of information.
>;
