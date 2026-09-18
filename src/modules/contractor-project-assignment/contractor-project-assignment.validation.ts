import { z } from "zod";
import { ContractorAssignmentStatus } from "@prisma/client";

export const contractorProjectAssignmentIdSchema = z.object({
    id: z.string().uuid("Invalid assignment ID."),
});

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

export const updateContractorProjectAssignmentSchema = z.object({
    responsibilityIds: z
        .array(z.string().uuid("Invalid responsibility ID."))
        .refine((ids) => new Set(ids).size === ids.length, {
            message: "Responsibility IDs must not contain duplicates.",
        })
        .optional(),
        
    scopeDescription: z
        .string()
        .trim()
        .nullable()
        .optional(),
        
    startDate: z
        .coerce.date()
        .nullable()
        .optional(),
        
    endDate: z
        .coerce.date()
        .nullable()
        .optional(),
        
    notes: z
        .string()
        .trim()
        .nullable()
        .optional(),
        
    status: z
        .nativeEnum(ContractorAssignmentStatus, {
            message: "Invalid status.",
        })
        .optional(),
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided for update." }
);
