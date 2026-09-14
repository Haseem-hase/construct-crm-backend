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

export const projectIdAndCustomerIdParamsSchema = z.object({
    projectId: z.string().uuid("Invalid project ID."),
    customerId: z.string().uuid("Invalid customer ID."),
});
