import { z } from "zod";

export const createCustomerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Customer name must be at least 2 characters.")
        .max(150, "Customer name must not exceed 150 characters."),

    type: z.enum(["COMPANY", "GOVERNMENT", "INDIVIDUAL", "OTHER"], {
        message: "Invalid customer type.",
    }),

    profileImageUrl: z
        .string()
        .trim()
        .url("Invalid URL for profile image.")
        .optional(),

    country: z
        .string()
        .trim()
        .max(100, "Country must not exceed 100 characters."),

    city: z
        .string()
        .trim()
        .max(100, "City must not exceed 100 characters."),

    address: z
        .string()
        .trim()
        .max(255, "Address must not exceed 255 characters.")
        .optional(),

    parentCustomerId: z
        .string()
        .uuid("Invalid parent customer ID.")
        .optional(),
});


export const updateCustomerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Customer name must be at least 2 characters.")
        .max(150, "Customer name must not exceed 150 characters.")
        .optional(),

    type: z.enum(["COMPANY", "GOVERNMENT", "INDIVIDUAL", "OTHER"], {
        message: "Invalid customer type.",
    }).optional(),

    profileImageUrl: z
        .string()
        .trim()
        .url("Invalid URL for profile image.")
        .optional(),

    country: z
        .string()
        .trim()
        .max(100, "Country must not exceed 100 characters.")
        .optional(),

    city: z
        .string()
        .trim()
        .max(100, "City must not exceed 100 characters.")
        .optional(),

    address: z
        .string()
        .trim()
        .max(255, "Address must not exceed 255 characters.")
        .optional(),

    parentCustomerId: z
        .string()
        .uuid("Invalid parent customer ID.")
        .optional(),

    isActive: z
        .boolean()
        .optional(),
});

export const customerIdSchema = z.object({
    id: z.string().uuid("Invalid customer ID."),
});