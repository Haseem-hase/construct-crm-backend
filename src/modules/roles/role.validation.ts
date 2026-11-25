// Study: This file is about job roles in each company and the actions people in those roles may take. Checks whether incoming information is complete and in the expected form.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";

// Study: Set up a check for incoming information using `z.object` and store the result as `createRoleSchema`.
export const createRoleSchema = z.object({
    // Study: Set `name` to `z .string() .trim() .min(2, "Role name must be at least 2 characters.") .max(50, "R…`.
    name: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 2 here. For text, the limit counts characters.
        .min(2, "Role name must be at least 2 characters.")
        // Study: Require at most 50 here. For text, the limit counts characters.
        .max(50, "Role name must not exceed 50 characters."),

    // Study: Set `description` to `z .string() .trim() .max(255, "Description must not exceed 255 characters.") .optio…`.
    description: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 255 here. For text, the limit counts characters.
        .max(255, "Description must not exceed 255 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `permissionIds` to `z .array(z.string().uuid("Invalid permission ID.")) .default([])`.
    permissionIds: z
        // Study: Continue the chain with `array`.
        .array(z.string().uuid("Invalid permission ID."))
        // Study: Use this default when no value is provided.
        .default([]),
// Study: End this group of values.
})

// Study: Set up a check for incoming information using `z.object` and store the result as `updateRoleSchema`.
export const updateRoleSchema = z.object({
    // Study: Set `name` to `z .string() .trim() .min(2, "Role name must be at least 2 characters.") .max(50, "R…`.
    name: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 2 here. For text, the limit counts characters.
        .min(2, "Role name must be at least 2 characters.")
        // Study: Require at most 50 here. For text, the limit counts characters.
        .max(50, "Role name must not exceed 50 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `description` to `z .string() .trim() .max(255, "Description must not exceed 255 characters.") .nulla…`.
    description: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 255 here. For text, the limit counts characters.
        .max(255, "Description must not exceed 255 characters.")
        // Study: Allow an explicit null value.
        .nullable()
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `permissionIds` to `z .array(z.string().uuid("Invalid permission ID.")) .optional()`.
    permissionIds: z
        // Study: Continue the chain with `array`.
        .array(z.string().uuid("Invalid permission ID."))
        // Study: Allow this value to be omitted.
        .optional(),   
// Study: End this group of values.
})

// Study: Set up a check for incoming information using `z.object` and store the result as `roleIdSchema`.
export const roleIdSchema = z.object({
    // Study: Check `id` using the rule `z.string().uuid("Invalid role ID.")`.
    id:z.string().uuid("Invalid role ID."),
// Study: End this group of values.
});

// Study: Derive the expected information for `CreateRoleInput` from the same rules that check submitted values.
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
// Study: Derive the expected information for `UpdateRoleInput` from the same rules that check submitted values.
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;