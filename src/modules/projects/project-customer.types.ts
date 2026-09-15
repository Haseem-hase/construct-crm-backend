import { z } from "zod";
import {
    createProjectCustomerSchema,
    updateProjectCustomerSchema,
    projectIdAndProjectCustomerIdParamsSchema
} from "./project-customer.validation";

export type CreateProjectCustomerInput = z.infer<typeof createProjectCustomerSchema>;
export type UpdateProjectCustomerInput = z.infer<typeof updateProjectCustomerSchema>;
export type ProjectIdAndProjectCustomerIdParams = z.infer<typeof projectIdAndProjectCustomerIdParamsSchema>;
