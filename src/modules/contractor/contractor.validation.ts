import { z } from "zod";

export const createContractorSchema = z.object({
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

    email: z
        .string()
        .trim()
        .email("Invalid email address.")
        .optional()
        .or(z.literal("")),

    alternativePhone: z
        .string()
        .trim()
        .max(50, "Alternative phone number must not exceed 50 characters.")
        .optional(),

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

    address: z
        .string()
        .trim()
        .max(255, "Address must not exceed 255 characters.")
        .optional(),

    profileImageUrl: z
        .string()
        .trim()
        .url("Invalid URL for profile image.")
        .optional()
        .or(z.literal("")),

    nationalId: z
        .string()
        .trim()
        .max(100, "National ID must not exceed 100 characters.")
        .optional(),

    licenseNumber: z
        .string()
        .trim()
        .max(100, "License number must not exceed 100 characters.")
        .optional(),

    licenseExpiryDate: z
        .coerce.date()
        .optional(),

    status: z.enum(["PENDING", "ACTIVE", "SUSPENDED", "INACTIVE", "TERMINATED"], {
        message: "Invalid status.",
    }).optional(),

    notes: z
        .string()
        .trim()
        .optional(),
});

export const updateContractorSchema = z.object({
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

    email: z
        .string()
        .trim()
        .email("Invalid email address.")
        .optional()
        .or(z.literal("")),

    alternativePhone: z
        .string()
        .trim()
        .max(50, "Alternative phone number must not exceed 50 characters.")
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

    address: z
        .string()
        .trim()
        .max(255, "Address must not exceed 255 characters.")
        .optional(),

    profileImageUrl: z
        .string()
        .trim()
        .url("Invalid URL for profile image.")
        .optional()
        .or(z.literal("")),

    nationalId: z
        .string()
        .trim()
        .max(100, "National ID must not exceed 100 characters.")
        .optional(),

    licenseNumber: z
        .string()
        .trim()
        .max(100, "License number must not exceed 100 characters.")
        .optional(),

    licenseExpiryDate: z
        .coerce.date()
        .optional(),

    status: z.enum(["PENDING", "ACTIVE", "SUSPENDED", "INACTIVE", "TERMINATED"], {
        message: "Invalid status.",
    }).optional(),

    notes: z
        .string()
        .trim()
        .optional(),
});

export const contractorIdSchema = z.object({
    id: z.string().uuid("Invalid contractor ID."),
});
