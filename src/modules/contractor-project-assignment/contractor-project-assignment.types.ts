import { z } from "zod";
import { 
    createContractorProjectAssignmentSchema,
    updateContractorProjectAssignmentSchema 
} from "./contractor-project-assignment.validation";

export type CreateContractorProjectAssignmentBody = z.infer<typeof createContractorProjectAssignmentSchema>;

export type UpdateContractorProjectAssignmentBody = z.infer<typeof updateContractorProjectAssignmentSchema>;
