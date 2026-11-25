// Study: This file is about which workers are assigned to each job. Checks whether incoming information is complete and in the expected form.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";
// Study: Bring in `{ LabourAssignmentStatus }` from `"@prisma/client"` so this file can use it.
import { LabourAssignmentStatus } from "@prisma/client";

// Study: Set up a check for incoming information using `z.object` and store the result as `labourAssignmentIdSchema`.
export const labourAssignmentIdSchema = z.object({
    // Study: Check `id` using the rule `z.string().uuid("Invalid labour assignment ID.")`.
    id: z.string().uuid("Invalid labour assignment ID."),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object({ labourId: z.string().uuid("Invalid labour ID."), contractorProjectAssign…` and store the result as `createLabourAssignmentSchema`.
export const createLabourAssignmentSchema = z.object({
    // Study: Check `labourId` using the rule `z.string().uuid("Invalid labour ID.")`.
    labourId: z.string().uuid("Invalid labour ID."),
    
    // Study: Check `contractorProjectAssignmentId` using the rule `z.string().uuid("Invalid contractor project assignment ID.")`.
    contractorProjectAssignmentId: z.string().uuid("Invalid contractor project assignment ID."),
    
    // Study: Check `startDate` using the rule `z.coerce.date()`.
    startDate: z.coerce.date(),
    
    // Study: Check `endDate` using the rule `z.coerce.date()`.
    endDate: z.coerce.date(),
    
    // Study: Set `notes` to `z .string() .trim() .optional()`.
    notes: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Allow this value to be omitted.
        .optional(),
// Study: Finish this group and continue the surrounding step.
}).strict().refine((data) => data.endDate >= data.startDate, {
    // Study: Set `message` to `"End date must be greater than or equal to start date."`.
    message: "End date must be greater than or equal to start date.",
    // Study: Start the nested value for `path`.
    path: ["endDate"],
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object({ startDate: z .coerce.date() .optional(), endDate: z .coerce.date() .opti…` and store the result as `updateLabourAssignmentSchema`.
export const updateLabourAssignmentSchema = z.object({
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
        
    // Study: Set `status` to `z .nativeEnum(LabourAssignmentStatus, { message: "Invalid status.", }) .optional()`.
    status: z
        // Study: Continue the chain with `nativeEnum`.
        .nativeEnum(LabourAssignmentStatus, {
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
// Study: Finish this group and continue the surrounding step.
).refine((data) => {
    // Study: Do the next step if this check passes: `data.startDate && data.endDate`.
    if (data.startDate && data.endDate) {
        // Study: Give `data.endDate >= data.startDate` back to the code that asked for it.
        return data.endDate >= data.startDate;
    // Study: End this group of steps.
    }
    // Study: Give `true` back to the code that asked for it.
    return true;
// Study: Finish this group and continue the surrounding step.
}, {
    // Study: Set `message` to `"End date must be greater than or equal to start date."`.
    message: "End date must be greater than or equal to start date.",
    // Study: Start the nested value for `path`.
    path: ["endDate"],
// Study: End this group of values.
});
