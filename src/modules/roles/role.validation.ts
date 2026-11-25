// Study: Use Zod to parse and validate inputs for role templates, organization roles, and permission assignments.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";

// Study: Build a Zod validation rule with `z.object` and store the result as `createRoleSchema`.
export const createRoleSchema = z.object({
    // Study: Set `name` to `z .string() .trim() .min(2, "Role name must be at least 2 characters.") .max(50, "R…`.
    name: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(2, "Role name must be at least 2 characters.")
        // Study: Enforce a maximum value or length.
        .max(50, "Role name must not exceed 50 characters."),

    // Study: Set `description` to `z .string() .trim() .max(255, "Description must not exceed 255 characters.") .optio…`.
    description: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(255, "Description must not exceed 255 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `permissionIds` to `z .array(z.string().uuid("Invalid permission ID.")) .default([])`.
    permissionIds: z
        // Study: Continue the chain with `array`.
        .array(z.string().uuid("Invalid permission ID."))
        // Study: Use this default when no value is provided.
        .default([]),
// Study: Close the object literal.
})

// Study: Build a Zod validation rule with `z.object` and store the result as `updateRoleSchema`.
export const updateRoleSchema = z.object({
    // Study: Set `name` to `z .string() .trim() .min(2, "Role name must be at least 2 characters.") .max(50, "R…`.
    name: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(2, "Role name must be at least 2 characters.")
        // Study: Enforce a maximum value or length.
        .max(50, "Role name must not exceed 50 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `description` to `z .string() .trim() .max(255, "Description must not exceed 255 characters.") .nulla…`.
    description: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
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
// Study: Close the object literal.
})

// Study: Build a Zod validation rule with `z.object` and store the result as `roleIdSchema`.
export const roleIdSchema = z.object({
    // Study: Validate `id` with `z.string().uuid("Invalid role ID.")`.
    id:z.string().uuid("Invalid role ID."),
// Study: Close the object literal.
});

// Study: Define the compile-time contract named `CreateRoleInput` from the Zod schema so the types follow validation.
export type CreateRoleInput = z.infer<typeof createRoleSchema>;
// Study: Define the compile-time contract named `UpdateRoleInput` from the Zod schema so the types follow validation.
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;