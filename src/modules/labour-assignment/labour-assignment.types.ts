import { z } from "zod";
import {
    createLabourAssignmentSchema,
    updateLabourAssignmentSchema,
    labourAssignmentIdSchema,
} from "./labour-assignment.validation";

export type CreateLabourAssignmentInput = z.infer<typeof createLabourAssignmentSchema>;

export type UpdateLabourAssignmentInput = z.infer<typeof updateLabourAssignmentSchema>;

export type LabourAssignmentIdParams = z.infer<typeof labourAssignmentIdSchema>;
