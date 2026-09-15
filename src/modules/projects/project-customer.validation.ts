import { z } from "zod";

const RelationshipTypeEnum = z.enum([
    "OWNER",
    "CLIENT",
    "DEVELOPER",
    "INVESTOR",
    "PARTNER",
    "OTHER"
]);

export const createProjectCustomerSchema = z.object({
    customerId: z.string().uuid("Invalid customer ID."),
    relationshipType: RelationshipTypeEnum,

    isPrimary: z
        .boolean()
        .optional()
        .default(false),
});

export const updateProjectCustomerSchema = z.object({
    relationshipType: RelationshipTypeEnum.optional(),

    isPrimary: z
        .boolean()
        .optional(),
});

export const projectIdAndProjectCustomerIdParamsSchema = z.object({
    projectId: z.string().uuid("Invalid project ID."),
    projectCustomerId: z.string().uuid("Invalid project customer ID."),
});
