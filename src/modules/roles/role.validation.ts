import { z } from "zod";

export const createRoleSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Role name must be at least 2 characters.")
        .max(50, "Role name must not exceed 50 characters."),

    description: z
        .string()
        .trim()
        .max(255, "Description must not exceed 255 characters.")
        .optional(),

    permissionIds: z
        .array(z.string().uuid("Invalid permission ID."))
        .default([]),
})

export const updateRoleSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Role name must be at least 2 characters.")
        .max(50, "Role name must not exceed 50 characters.")
        .optional(),

    description: z
        .string()
        .trim()
        .max(255, "Description must not exceed 255 characters.")
        .nullable()
        .optional(),

    permissionIds: z
        .array(z.string().uuid("Invalid permission ID."))
        .optional(),   
})

export const roleIdSchema = z.object({
    id:z.string().uuid("Invalid role ID."),
});

export type CreateRoleInput = z.infer<typeof createRoleSchema>;
export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;