import { z } from "zod";

export const createCustomerContactSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Contact name must be at least 2 characters.")
        .max(150, "Contact name must not exceed 150 characters."),

    designation: z
        .string()
        .trim()
        .min(2, "Designation must be at least 2 characters.")
        .max(100, "Designation must not exceed 100 characters."),

    phone: z
        .string()
        .trim()
        .min(1, "Phone number must not be empty.")
        .max(30, "Phone number must not exceed 30 characters."),

    otherPhone: z
        .string()
        .trim()
        .max(30, "Other phone number must not exceed 30 characters.")
        .optional(),

    email: z
        .string()
        .trim()
        .email("Invalid email address.")
        .max(255, "Email must not exceed 255 characters."),

    profileImageUrl: z
        .string()
        .trim()
        .url("Invalid URL for profile image.")
        .max(500, "Profile image URL must not exceed 500 characters.")
        .optional(),

    isPrimary: z
        .boolean()
        .optional()
        .default(false),
});

export const updateCustomerContactSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Contact name must be at least 2 characters.")
        .max(150, "Contact name must not exceed 150 characters.")
        .optional(),

    designation: z
        .string()
        .trim()
        .min(2, "Designation must be at least 2 characters.")
        .max(100, "Designation must not exceed 100 characters.")
        .optional(),

    phone: z
        .string()
        .trim()
        .min(1, "Phone number must not be empty.")
        .max(30, "Phone number must not exceed 30 characters.")
        .optional(),

    otherPhone: z
        .string()
        .trim()
        .max(30, "Other phone number must not exceed 30 characters.")
        .optional(),

    email: z
        .string()
        .trim()
        .email("Invalid email address.")
        .max(255, "Email must not exceed 255 characters.")
        .optional(),

    profileImageUrl: z
        .string()
        .trim()
        .url("Invalid URL for profile image.")
        .max(500, "Profile image URL must not exceed 500 characters.")
        .optional(),

    isPrimary: z
        .boolean()
        .optional(),
});

export const contactIdSchema = z.object({
    contactId: z.string().uuid("Invalid contact ID."),
});

export const customerAndContactIdParamsSchema = z.object({
    customerId: z.string().uuid("Invalid customer ID."),
    contactId: z.string().uuid("Invalid contact ID."),
});
