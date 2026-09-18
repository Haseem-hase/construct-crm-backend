import { z } from "zod";

export const createContractorProjectAssignmentSchema = z.object({
    projectId: z.string().uuid("Invalid project ID."),
    
    contractorId: z.string().uuid("Invalid contractor ID."),
    
    responsibilityIds: z
        .array(z.string().uuid("Invalid responsibility ID."))
        .refine((ids) => new Set(ids).size === ids.length, {
            message: "Responsibility IDs must not contain duplicates.",
        })
        .optional(),
        
    scopeDescription: z
        .string()
        .trim()
        .optional(),
        
    startDate: z
        .coerce.date()
        .optional(),
        
    endDate: z
        .coerce.date()
        .optional(),
        
    notes: z
        .string()
        .trim()
        .optional(),
}).strict();
