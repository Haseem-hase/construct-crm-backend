import { z } from "zod";
import { createContractorProjectAssignmentSchema } from "./contractor-project-assignment.validation";

export type CreateContractorProjectAssignmentBody = z.infer<typeof createContractorProjectAssignmentSchema>;
