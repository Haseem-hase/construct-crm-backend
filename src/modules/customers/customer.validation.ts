import { z } from "zod";

export const createCustomerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Customer name must be at least 2 characters.")
        .max(150, "Customer name must not exceed 150 characters."),

    customerCode: z
        .string()
        .trim()
        .min(2, "Customer code must be at least 2 characters.")
        .max(50, "Customer code must not exceed 50 characters."),

    description: z
        .string()
        .trim()
        .max(1000, "Description must not exceed 1000 characters.")
        .optional(),

    email: z
        .email("Invalid email address.")
        .trim()
        .toLowerCase()
        .optional(),

    phone: z
        .string()
        .trim()
        .min(8, "Phone number must be at least 8 characters.")
        .max(20, "Phone number must not exceed 20 characters.")
        .optional(),

    address: z
        .string()
        .trim()
        .max(255, "Address must not exceed 255 characters.")
        .optional(),

    city: z
        .string()
        .trim()
        .max(100, "City must not exceed 100 characters.")
        .optional(),

    country: z
        .string()
        .trim()
        .max(100, "Country must not exceed 100 characters.")
        .optional(),

    postalCode: z
        .string()
        .trim()
        .max(20, "Postal code must not exceed 20 characters.")
        .optional(),
});


export const updateCustomerSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Customer name must be at least 2 characters.")
        .max(150, "Customer name must not exceed 150 characters.")
        .optional(),

    description: z
        .string()
        .trim()
        .max(1000, "Description must not exceed 1000 characters.")
        .optional(),

    email: z
        .email("Invalid email address.")
        .trim()
        .toLowerCase()
        .optional(),

    phone: z
        .string()
        .trim()
        .min(8, "Phone number must be at least 8 characters.")
        .max(20, "Phone number must not exceed 20 characters.")
        .optional(),

    address: z
        .string()
        .trim()
        .max(255, "Address must not exceed 255 characters.")
        .optional(),

    city: z
        .string()
        .trim()
        .max(100, "City must not exceed 100 characters.")
        .optional(),

    country: z
        .string()
        .trim()
        .max(100, "Country must not exceed 100 characters.")
        .optional(),

    postalCode: z
        .string()
        .trim()
        .max(20, "Postal code must not exceed 20 characters.")
        .optional(),
});