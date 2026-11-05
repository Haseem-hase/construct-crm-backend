import { z } from "zod";

const customerProfileImageUrl = z.string().trim().refine(
    value => /^\/uploads\/customers\/[0-9a-f-]{36}\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/i.test(value),
    "Upload a JPEG, PNG, or WebP customer photo.",
);

export const createCustomerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Customer name must be at least 2 characters.")
        .max(150, "Customer name must not exceed 150 characters."),

    type: z.enum(["COMPANY", "GOVERNMENT", "INDIVIDUAL", "OTHER"], {
        message: "Invalid customer type.",
    }),

    profileImageUrl: customerProfileImageUrl.optional(),

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

    profileImageUrl: customerProfileImageUrl.optional().or(z.literal("")),

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
        .preprocess(value => typeof value === "string" ? value === "true" : value, z.boolean())
        .optional(),
});

export const customerIdSchema = z.object({
    id: z.string().uuid("Invalid customer ID."),
});
