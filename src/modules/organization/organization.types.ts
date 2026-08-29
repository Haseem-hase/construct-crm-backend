import { z } from "zod";
import { registerOrganizationSchema } from "./organization.validation";

export type RegisterOrganizationInput = z.infer<
    typeof registerOrganizationSchema
>;