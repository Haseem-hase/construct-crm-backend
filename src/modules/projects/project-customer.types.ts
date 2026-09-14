import { z } from "zod";
import {
    createProjectCustomerSchema,
    updateProjectCustomerSchema,
    projectIdAndCustomerIdParamsSchema
} from "./project-customer.validation";

export type CreateProjectCustomerInput = z.infer<typeof createProjectCustomerSchema>;
export type UpdateProjectCustomerInput = z.infer<typeof updateProjectCustomerSchema>;
export type ProjectIdAndCustomerIdParams = z.infer<typeof projectIdAndCustomerIdParamsSchema>;
