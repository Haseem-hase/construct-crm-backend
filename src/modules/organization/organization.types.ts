import { z } from "zod";
import { registerOrganizationSchema } from "./organization.validation";

export type RegisterOrganizationInput = z.infer<
    typeof registerOrganizationSchema
>;

export interface CreateOrganizationInput {
    organizationName: string;

    fullName: string;
    email: string;
    phone: string;
    password: string;

    roleId: string;
}