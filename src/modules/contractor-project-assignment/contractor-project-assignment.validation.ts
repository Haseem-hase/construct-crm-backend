// Study: Use Zod to parse and validate inputs for contractor placements on projects and their responsibilities.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";
// Study: Import `{ ContractorAssignmentStatus }` from `"@prisma/client"`.
import { ContractorAssignmentStatus } from "@prisma/client";

// Study: Build a Zod validation rule with `z.object` and store the result as `contractorProjectAssignmentIdSchema`.
export const contractorProjectAssignmentIdSchema = z.object({
    // Study: Validate `id` with `z.string().uuid("Invalid assignment ID.")`.
    id: z.string().uuid("Invalid assignment ID."),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object({ projectId: z.string().uuid("Invalid project ID."), contractorId: z.strin…` and store the result as `createContractorProjectAssignmentSchema`.
export const createContractorProjectAssignmentSchema = z.object({
    // Study: Validate `projectId` with `z.string().uuid("Invalid project ID.")`.
    projectId: z.string().uuid("Invalid project ID."),
    
    // Study: Validate `contractorId` with `z.string().uuid("Invalid contractor ID.")`.
    contractorId: z.string().uuid("Invalid contractor ID."),
    
    // Study: Set `responsibilityIds` to `z .array(z.string().uuid("Invalid responsibility ID.")) .refine((ids) => new Set(id…`.
    responsibilityIds: z
        // Study: Continue the chain with `array`.
        .array(z.string().uuid("Invalid responsibility ID."))
        // Study: Apply a custom validation rule.
        .refine((ids) => new Set(ids).size === ids.length, {
            // Study: Set `message` to `"Responsibility IDs must not contain duplicates."`.
            message: "Responsibility IDs must not contain duplicates.",
        // Study: Close the object literal.
        })
        // Study: Allow this value to be omitted.
        .optional(),
        
    // Study: Set `scopeDescription` to `z .string() .trim() .optional()`.
    scopeDescription: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
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
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Allow this value to be omitted.
        .optional(),
// Study: Close this group and continue the enclosing expression.
}).strict();

// Study: Build a Zod validation rule with `z.object({ responsibilityIds: z .array(z.string().uuid("Invalid responsibility ID."…` and store the result as `updateContractorProjectAssignmentSchema`.
export const updateContractorProjectAssignmentSchema = z.object({
    // Study: Set `responsibilityIds` to `z .array(z.string().uuid("Invalid responsibility ID.")) .refine((ids) => new Set(id…`.
    responsibilityIds: z
        // Study: Continue the chain with `array`.
        .array(z.string().uuid("Invalid responsibility ID."))
        // Study: Apply a custom validation rule.
        .refine((ids) => new Set(ids).size === ids.length, {
            // Study: Set `message` to `"Responsibility IDs must not contain duplicates."`.
            message: "Responsibility IDs must not contain duplicates.",
        // Study: Close the object literal.
        })
        // Study: Allow this value to be omitted.
        .optional(),
        
    // Study: Set `scopeDescription` to `z .string() .trim() .nullable() .optional()`.
    scopeDescription: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
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
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
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
        // Study: Close the object literal.
        })
        // Study: Allow this value to be omitted.
        .optional(),
// Study: Close this group and continue the enclosing expression.
}).strict().refine(
    // Study: Supply `data` to the surrounding statement.
    (data) => Object.keys(data).length > 0,
    // Study: Start the object passed to the surrounding expression.
    { message: "At least one field must be provided for update." }
// Study: Close the call arguments.
);
