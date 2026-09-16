import { z } from "zod";

export const createLabourSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters.")
        .max(150, "Full name must not exceed 150 characters."),

    phone: z
        .string()
        .trim()
        .min(5, "Phone number is too short.")
        .max(50, "Phone number must not exceed 50 characters."),

    professionId: z
        .string()
        .uuid("Invalid profession ID."),

    country: z
        .string()
        .trim()
        .min(2, "Country is required.")
        .max(100, "Country must not exceed 100 characters."),

    city: z
        .string()
        .trim()
        .min(1, "City is required.")
        .max(100, "City must not exceed 100 characters."),

    email: z
        .string()
        .trim()
        .email("Invalid email address.")
        .optional()
        .or(z.literal("")), // Allow empty string as optional depending on client form logic

    dateOfBirth: z
        .coerce.date()
        .optional(),

    profileImageUrl: z
        .string()
        .trim()
        .url("Invalid URL for profile image.")
        .optional()
        .or(z.literal("")),

    address: z
        .string()
        .trim()
        .max(255, "Address must not exceed 255 characters.")
        .optional(),

    emergencyContactName: z
        .string()
        .trim()
        .max(150, "Emergency contact name must not exceed 150 characters.")
        .optional(),

    emergencyContactPhone: z
        .string()
        .trim()
        .max(50, "Emergency contact phone must not exceed 50 characters.")
        .optional(),

    joiningDate: z
        .coerce.date()
        .optional(),

    status: z.enum(["ACTIVE", "INACTIVE"], {
        message: "Invalid status. Must be ACTIVE or INACTIVE.",
    }).optional(),

    notes: z
        .string()
        .trim()
        .optional(),
});

export const updateLabourSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(2, "Full name must be at least 2 characters.")
        .max(150, "Full name must not exceed 150 characters.")
        .optional(),

    phone: z
        .string()
        .trim()
        .min(5, "Phone number is too short.")
        .max(50, "Phone number must not exceed 50 characters.")
        .optional(),

    professionId: z
        .string()
        .uuid("Invalid profession ID.")
        .optional(),

    country: z
        .string()
        .trim()
        .min(2, "Country is required.")
        .max(100, "Country must not exceed 100 characters.")
        .optional(),

    city: z
        .string()
        .trim()
        .min(1, "City is required.")
        .max(100, "City must not exceed 100 characters.")
        .optional(),

    email: z
        .string()
        .trim()
        .email("Invalid email address.")
        .optional()
        .or(z.literal("")),

    dateOfBirth: z
        .coerce.date()
        .optional(),

    profileImageUrl: z
        .string()
        .trim()
        .url("Invalid URL for profile image.")
        .optional()
        .or(z.literal("")),

    address: z
        .string()
        .trim()
        .max(255, "Address must not exceed 255 characters.")
        .optional(),

    emergencyContactName: z
        .string()
        .trim()
        .max(150, "Emergency contact name must not exceed 150 characters.")
        .optional(),

    emergencyContactPhone: z
        .string()
        .trim()
        .max(50, "Emergency contact phone must not exceed 50 characters.")
        .optional(),

    joiningDate: z
        .coerce.date()
        .optional(),

    status: z.enum(["ACTIVE", "INACTIVE"], {
        message: "Invalid status. Must be ACTIVE or INACTIVE.",
    }).optional(),

    notes: z
        .string()
        .trim()
        .optional(),
});

export const labourIdSchema = z.object({
    id: z.string().uuid("Invalid labour ID."),
});
