import { z } from "zod";
import { LabourAssignmentStatus } from "@prisma/client";

export const labourAssignmentIdSchema = z.object({
    id: z.string().uuid("Invalid labour assignment ID."),
});

export const createLabourAssignmentSchema = z.object({
    labourId: z.string().uuid("Invalid labour ID."),
    
    contractorProjectAssignmentId: z.string().uuid("Invalid contractor project assignment ID."),
    
    startDate: z.coerce.date(),
    
    endDate: z.coerce.date(),
    
    notes: z
        .string()
        .trim()
        .optional(),
}).strict().refine((data) => data.endDate >= data.startDate, {
    message: "End date must be greater than or equal to start date.",
    path: ["endDate"],
});

export const updateLabourAssignmentSchema = z.object({
    startDate: z
        .coerce.date()
        .optional(),
        
    endDate: z
        .coerce.date()
        .optional(),
        
    notes: z
        .string()
        .trim()
        .nullable()
        .optional(),
        
    status: z
        .nativeEnum(LabourAssignmentStatus, {
            message: "Invalid status.",
        })
        .optional(),
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    { message: "At least one field must be provided for update." }
).refine((data) => {
    if (data.startDate && data.endDate) {
        return data.endDate >= data.startDate;
    }
    return true;
}, {
    message: "End date must be greater than or equal to start date.",
    path: ["endDate"],
});
