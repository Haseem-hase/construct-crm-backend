// Study: This file is about which contractors work on which jobs and what they are responsible for. Checks whether incoming information is complete and in the expected form.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";
// Study: Bring in `{ ContractorAssignmentStatus }` from `"@prisma/client"` so this file can use it.
import { ContractorAssignmentStatus } from "@prisma/client";

// Study: Set up a check for incoming information using `z.object` and store the result as `contractorProjectAssignmentIdSchema`.
export const contractorProjectAssignmentIdSchema = z.object({
    // Study: Check `id` using the rule `z.string().uuid("Invalid assignment ID.")`.
    id: z.string().uuid("Invalid assignment ID."),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object({ projectId: z.string().uuid("Invalid project ID."), contractorId: z.strin…` and store the result as `createContractorProjectAssignmentSchema`.
export const createContractorProjectAssignmentSchema = z.object({
    // Study: Check `projectId` using the rule `z.string().uuid("Invalid project ID.")`.
    projectId: z.string().uuid("Invalid project ID."),
    
    // Study: Check `contractorId` using the rule `z.string().uuid("Invalid contractor ID.")`.
    contractorId: z.string().uuid("Invalid contractor ID."),
    
    // Study: Set `responsibilityIds` to `z .array(z.string().uuid("Invalid responsibility ID.")) .refine((ids) => new Set(id…`.
    responsibilityIds: z
        // Study: Continue the chain with `array`.
        .array(z.string().uuid("Invalid responsibility ID."))
        // Study: Apply a custom validation rule.
        .refine((ids) => new Set(ids).size === ids.length, {
            // Study: Set `message` to `"Responsibility IDs must not contain duplicates."`.
            message: "Responsibility IDs must not contain duplicates.",
        // Study: End this group of values.
        })
        // Study: Allow this value to be omitted.
        .optional(),
        
    // Study: Set `scopeDescription` to `z .string() .trim() .optional()`.
    scopeDescription: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Allow this value to be omitted.
        .optional(),
        
    // Study: Set `startDate` to `z .coerce.date() .optional()`.
    startDate: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow this value to be omitted.
        .optional(),
        
    // Study: Set `endDate` to `z .coerce.date() .optional()`.
    endDate: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow this value to be omitted.
        .optional(),
        
    // Study: Set `notes` to `z .string() .trim() .optional()`.
    notes: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Allow this value to be omitted.
        .optional(),
// Study: Finish this group and continue the surrounding step.
}).strict();

// Study: Set up a check for incoming information using `z.object({ responsibilityIds: z .array(z.string().uuid("Invalid responsibility ID."…` and store the result as `updateContractorProjectAssignmentSchema`.
export const updateContractorProjectAssignmentSchema = z.object({
    // Study: Set `responsibilityIds` to `z .array(z.string().uuid("Invalid responsibility ID.")) .refine((ids) => new Set(id…`.
    responsibilityIds: z
        // Study: Continue the chain with `array`.
        .array(z.string().uuid("Invalid responsibility ID."))
        // Study: Apply a custom validation rule.
        .refine((ids) => new Set(ids).size === ids.length, {
            // Study: Set `message` to `"Responsibility IDs must not contain duplicates."`.
            message: "Responsibility IDs must not contain duplicates.",
        // Study: End this group of values.
        })
        // Study: Allow this value to be omitted.
        .optional(),
        
    // Study: Set `scopeDescription` to `z .string() .trim() .nullable() .optional()`.
    scopeDescription: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Allow an explicit null value.
        .nullable()
        // Study: Allow this value to be omitted.
        .optional(),
        
    // Study: Set `startDate` to `z .coerce.date() .nullable() .optional()`.
    startDate: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow an explicit null value.
        .nullable()
        // Study: Allow this value to be omitted.
        .optional(),
        
    // Study: Set `endDate` to `z .coerce.date() .nullable() .optional()`.
    endDate: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow an explicit null value.
        .nullable()
        // Study: Allow this value to be omitted.
        .optional(),
        
    // Study: Set `notes` to `z .string() .trim() .nullable() .optional()`.
    notes: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Allow an explicit null value.
        .nullable()
        // Study: Allow this value to be omitted.
        .optional(),
        
    // Study: Set `status` to `z .nativeEnum(ContractorAssignmentStatus, { message: "Invalid status.", }) .optional()`.
    status: z
        // Study: Continue the chain with `nativeEnum`.
        .nativeEnum(ContractorAssignmentStatus, {
            // Study: Set `message` to `"Invalid status."`.
            message: "Invalid status.",
        // Study: End this group of values.
        })
        // Study: Allow this value to be omitted.
        .optional(),
// Study: Finish this group and continue the surrounding step.
}).strict().refine(
    // Study: Supply `data` to the surrounding statement.
    (data) => Object.keys(data).length > 0,
    // Study: Start the object passed to the surrounding expression.
    { message: "At least one field must be provided for update." }
// Study: End the list of information being sent to this step.
);
