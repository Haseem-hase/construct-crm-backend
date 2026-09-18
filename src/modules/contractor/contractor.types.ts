import { z } from "zod";

import {
    createContractorSchema,
    updateContractorSchema,
    contractorIdSchema,
} from "./contractor.validation";

export type CreateContractorInput = z.infer<
    typeof createContractorSchema
>;

export type UpdateContractorInput = z.infer<
    typeof updateContractorSchema
>;

export type ContractorIdParams = z.infer<
    typeof contractorIdSchema
>;
