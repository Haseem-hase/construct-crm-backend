// Study: Use Zod to parse and validate inputs for worker placements on construction projects.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";
// Study: Import `{ LabourAssignmentStatus }` from `"@prisma/client"`.
import { LabourAssignmentStatus } from "@prisma/client";

// Study: Build a Zod validation rule with `z.object` and store the result as `labourAssignmentIdSchema`.
export const labourAssignmentIdSchema = z.object({
    // Study: Validate `id` with `z.string().uuid("Invalid labour assignment ID.")`.
    id: z.string().uuid("Invalid labour assignment ID."),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object({ labourId: z.string().uuid("Invalid labour ID."), contractorProjectAssign…` and store the result as `createLabourAssignmentSchema`.
export const createLabourAssignmentSchema = z.object({
    // Study: Validate `labourId` with `z.string().uuid("Invalid labour ID.")`.
    labourId: z.string().uuid("Invalid labour ID."),
    
    // Study: Validate `contractorProjectAssignmentId` with `z.string().uuid("Invalid contractor project assignment ID.")`.
    contractorProjectAssignmentId: z.string().uuid("Invalid contractor project assignment ID."),
    
    // Study: Validate `startDate` with `z.coerce.date()`.
    startDate: z.coerce.date(),
    
    // Study: Validate `endDate` with `z.coerce.date()`.
    endDate: z.coerce.date(),
    
    // Study: Set `notes` to `z .string() .trim() .optional()`.
    notes: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Allow this value to be omitted.
        .optional(),
// Study: Close this group and continue the enclosing expression.
}).strict().refine((data) => data.endDate >= data.startDate, {
    // Study: Set `message` to `"End date must be greater than or equal to start date."`.
    message: "End date must be greater than or equal to start date.",
    // Study: Start the nested value for `path`.
    path: ["endDate"],
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object({ startDate: z .coerce.date() .optional(), endDate: z .coerce.date() .opti…` and store the result as `updateLabourAssignmentSchema`.
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
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
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
// Study: Close this group and continue the enclosing expression.
).refine((data) => {
    // Study: Run the following branch when `data.startDate && data.endDate` is truthy.
    if (data.startDate && data.endDate) {
        // Study: Return `data.endDate >= data.startDate` to the caller.
        return data.endDate >= data.startDate;
    // Study: Close the code block.
    }
    // Study: Return `true` to the caller.
    return true;
// Study: Close this group and continue the enclosing expression.
}, {
    // Study: Set `message` to `"End date must be greater than or equal to start date."`.
    message: "End date must be greater than or equal to start date.",
    // Study: Start the nested value for `path`.
    path: ["endDate"],
// Study: Close the object literal.
});
