import { z } from "zod";

import {
    createLabourSchema,
    updateLabourSchema,
    labourIdSchema,
} from "./labour.validation";

export type CreateLabourInput = z.infer<
    typeof createLabourSchema
>;

export type UpdateLabourInput = z.infer<
    typeof updateLabourSchema
>;

export type LabourIdParams = z.infer<
    typeof labourIdSchema
>;
