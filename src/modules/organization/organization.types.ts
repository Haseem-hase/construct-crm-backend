import { z } from "zod";
import {
    createOrganizationSchema,
    listOrganizationsQuerySchema,
    registerOrganizationSchema,
} from "./organization.validation";

export type RegisterOrganizationInput = z.infer<
    typeof registerOrganizationSchema
>;

export type CreateOrganizationRequest = z.infer<typeof createOrganizationSchema>;
export type ListOrganizationsQuery = z.infer<typeof listOrganizationsQuerySchema>;

export interface CreateOrganizationInput {
    organizationName: string;
    description?: string;

    fullName: string;
    email: string;
    phone: string;
    password: string;

    roleId: string;
}
