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
}).strict();

export const updateProjectCustomerSchema = z.object({
    relationshipType: RelationshipTypeEnum.optional(),

    isPrimary: z
        .boolean()
        .optional(),
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field must be provided for update.",
    }
);

export const projectIdAndProjectCustomerIdParamsSchema = z.object({
    projectId: z.string().uuid("Invalid project ID."),
    projectCustomerId: z.string().uuid("Invalid project customer ID."),
}).strict();

export const projectIdSchema = z.object({
    projectId: z.string().uuid("Invalid project ID."),
}).strict();
