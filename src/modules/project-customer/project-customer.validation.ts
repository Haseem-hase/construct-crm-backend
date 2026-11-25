// Study: This file is about which customers are connected to each job and in what role. Checks whether incoming information is complete and in the expected form.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";

// Study: Set up a check for incoming information using `z.enum` and store the result as `RelationshipTypeEnum`.
const RelationshipTypeEnum = z.enum([
    // Study: Supply the literal string `"OWNER"` here.
    "OWNER",
    // Study: Supply the literal string `"CLIENT"` here.
    "CLIENT",
    // Study: Supply the literal string `"DEVELOPER"` here.
    "DEVELOPER",
    // Study: Supply the literal string `"INVESTOR"` here.
    "INVESTOR",
    // Study: Supply the literal string `"PARTNER"` here.
    "PARTNER",
    // Study: Supply the literal string `"OTHER"` here.
    "OTHER"
// Study: End this group of values.
]);

// Study: Set up a check for incoming information using `z.object({ customerId: z.string().uuid("Invalid customer ID."), relationshipType: R…` and store the result as `createProjectCustomerSchema`.
export const createProjectCustomerSchema = z.object({
    // Study: Check `customerId` using the rule `z.string().uuid("Invalid customer ID.")`.
    customerId: z.string().uuid("Invalid customer ID."),
    // Study: Set `relationshipType` to `RelationshipTypeEnum`.
    relationshipType: RelationshipTypeEnum,

    // Study: Set `isPrimary` to `z .boolean() .optional() .default(false)`.
    isPrimary: z
        // Study: Continue the chain with `boolean`.
        .boolean()
        // Study: Allow this value to be omitted.
        .optional()
        // Study: Use this default when no value is provided.
        .default(false),
// Study: Finish this group and continue the surrounding step.
}).strict();

// Study: Set up a check for incoming information using `z.object({ relationshipType: RelationshipTypeEnum.optional(), isPrimary: z .boolean…` and store the result as `updateProjectCustomerSchema`.
export const updateProjectCustomerSchema = z.object({
    // Study: Set `relationshipType` to `RelationshipTypeEnum.optional()`.
    relationshipType: RelationshipTypeEnum.optional(),

    // Study: Set `isPrimary` to `z .boolean() .optional()`.
    isPrimary: z
        // Study: Continue the chain with `boolean`.
        .boolean()
        // Study: Allow this value to be omitted.
        .optional(),
// Study: Finish this group and continue the surrounding step.
}).strict().refine(
    // Study: Supply `data` to the surrounding statement.
    (data) => Object.keys(data).length > 0,
    // Study: Start the object passed to the surrounding expression.
    {
        // Study: Set `message` to `"At least one field must be provided for update."`.
        message: "At least one field must be provided for update.",
    // Study: End this group of values.
    }
// Study: End the list of information being sent to this step.
);

// Study: Set up a check for incoming information using `z.object({ projectId: z.string().uuid("Invalid project ID."), projectCustomerId: z.…` and store the result as `projectIdAndProjectCustomerIdParamsSchema`.
export const projectIdAndProjectCustomerIdParamsSchema = z.object({
    // Study: Check `projectId` using the rule `z.string().uuid("Invalid project ID.")`.
    projectId: z.string().uuid("Invalid project ID."),
    // Study: Check `projectCustomerId` using the rule `z.string().uuid("Invalid project customer ID.")`.
    projectCustomerId: z.string().uuid("Invalid project customer ID."),
// Study: Finish this group and continue the surrounding step.
}).strict();

// Study: Set up a check for incoming information using `z.object({ projectId: z.string().uuid("Invalid project ID."), }).strict` and store the result as `projectIdSchema`.
export const projectIdSchema = z.object({
    // Study: Check `projectId` using the rule `z.string().uuid("Invalid project ID.")`.
    projectId: z.string().uuid("Invalid project ID."),
// Study: Finish this group and continue the surrounding step.
}).strict();
