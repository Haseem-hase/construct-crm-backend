// Study: This file is about workers and the kinds of work they do. Checks whether incoming information is complete and in the expected form.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";

// Study: Set up a check for incoming information using `z.object` and store the result as `createLabourSchema`.
export const createLabourSchema = z.object({
    // Study: Set `fullName` to `z .string() .trim() .min(2, "Full name must be at least 2 characters.") .max(150, "…`.
    fullName: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 2 here. For text, the limit counts characters.
        .min(2, "Full name must be at least 2 characters.")
        // Study: Require at most 150 here. For text, the limit counts characters.
        .max(150, "Full name must not exceed 150 characters."),

    // Study: Set `phone` to `z .string() .trim() .min(5, "Phone number is too short.") .max(50, "Phone number mu…`.
    phone: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 5 here. For text, the limit counts characters.
        .min(5, "Phone number is too short.")
        // Study: Require at most 50 here. For text, the limit counts characters.
        .max(50, "Phone number must not exceed 50 characters."),

    // Study: Set `professionId` to `z .string() .uuid("Invalid profession ID.")`.
    professionId: z
        // Study: Require this value to be text.
        .string()
        // Study: Continue the chain with `uuid`.
        .uuid("Invalid profession ID."),

    // Study: Set `country` to `z .string() .trim() .min(2, "Country is required.") .max(100, "Country must not exc…`.
    country: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 2 here. For text, the limit counts characters.
        .min(2, "Country is required.")
        // Study: Require at most 100 here. For text, the limit counts characters.
        .max(100, "Country must not exceed 100 characters."),

    // Study: Set `city` to `z .string() .trim() .min(1, "City is required.") .max(100, "City must not exceed 10…`.
    city: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 1 here. For text, the limit counts characters.
        .min(1, "City is required.")
        // Study: Require at most 100 here. For text, the limit counts characters.
        .max(100, "City must not exceed 100 characters."),

    // Study: Set `email` to `z .string() .trim() .email("Invalid email address.") .optional() .or(z.literal(""))`.
    email: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Continue the chain with `email`.
        .email("Invalid email address.")
        // Study: Allow this value to be omitted.
        .optional()
        // Study: Accept the alternative value defined by this schema.
        .or(z.literal("")), // Allow empty string as optional depending on client form logic

    // Study: Set `dateOfBirth` to `z .coerce.date() .optional()`.
    dateOfBirth: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `profileImageUrl` to `z .string() .trim() .refine(value => /^\/uploads\/labour\/[0-9a-f-]{36}\/[a-zA-Z0-9…`.
    profileImageUrl: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Apply a custom validation rule.
        .refine(value => /^\/uploads\/labour\/[0-9a-f-]{36}\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/i.test(value) || z.string().url().safeParse(value).success, "Invalid URL for profile image.")
        // Study: Allow this value to be omitted.
        .optional()
        // Study: Accept the alternative value defined by this schema.
        .or(z.literal("")),

    // Study: Set `address` to `z .string() .trim() .max(255, "Address must not exceed 255 characters.") .optional()`.
    address: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 255 here. For text, the limit counts characters.
        .max(255, "Address must not exceed 255 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `emergencyContactName` to `z .string() .trim() .max(150, "Emergency contact name must not exceed 150 character…`.
    emergencyContactName: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 150 here. For text, the limit counts characters.
        .max(150, "Emergency contact name must not exceed 150 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `emergencyContactPhone` to `z .string() .trim() .max(50, "Emergency contact phone must not exceed 50 characters…`.
    emergencyContactPhone: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 50 here. For text, the limit counts characters.
        .max(50, "Emergency contact phone must not exceed 50 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `joiningDate` to `z .coerce.date() .optional()`.
    joiningDate: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Check `status` using the rule `z.enum(["ACTIVE", "INACTIVE"], { message: "Invalid status. Must be ACTIVE or INACTI…`.
    status: z.enum(["ACTIVE", "INACTIVE"], {
        // Study: Set `message` to `"Invalid status. Must be ACTIVE or INACTIVE."`.
        message: "Invalid status. Must be ACTIVE or INACTIVE.",
    // Study: Finish this group and continue the surrounding step.
    }).optional(),

    // Study: Set `notes` to `z .string() .trim() .optional()`.
    notes: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Allow this value to be omitted.
        .optional(),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `updateLabourSchema`.
export const updateLabourSchema = z.object({
    // Study: Set `fullName` to `z .string() .trim() .min(2, "Full name must be at least 2 characters.") .max(150, "…`.
    fullName: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 2 here. For text, the limit counts characters.
        .min(2, "Full name must be at least 2 characters.")
        // Study: Require at most 150 here. For text, the limit counts characters.
        .max(150, "Full name must not exceed 150 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `phone` to `z .string() .trim() .min(5, "Phone number is too short.") .max(50, "Phone number mu…`.
    phone: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 5 here. For text, the limit counts characters.
        .min(5, "Phone number is too short.")
        // Study: Require at most 50 here. For text, the limit counts characters.
        .max(50, "Phone number must not exceed 50 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `professionId` to `z .string() .uuid("Invalid profession ID.") .optional()`.
    professionId: z
        // Study: Require this value to be text.
        .string()
        // Study: Continue the chain with `uuid`.
        .uuid("Invalid profession ID.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `country` to `z .string() .trim() .min(2, "Country is required.") .max(100, "Country must not exc…`.
    country: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 2 here. For text, the limit counts characters.
        .min(2, "Country is required.")
        // Study: Require at most 100 here. For text, the limit counts characters.
        .max(100, "Country must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `city` to `z .string() .trim() .min(1, "City is required.") .max(100, "City must not exceed 10…`.
    city: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 1 here. For text, the limit counts characters.
        .min(1, "City is required.")
        // Study: Require at most 100 here. For text, the limit counts characters.
        .max(100, "City must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `email` to `z .string() .trim() .email("Invalid email address.") .optional() .or(z.literal(""))`.
    email: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Continue the chain with `email`.
        .email("Invalid email address.")
        // Study: Allow this value to be omitted.
        .optional()
        // Study: Accept the alternative value defined by this schema.
        .or(z.literal("")),

    // Study: Set `dateOfBirth` to `z .coerce.date() .optional()`.
    dateOfBirth: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `profileImageUrl` to `z .string() .trim() .refine(value => /^\/uploads\/labour\/[0-9a-f-]{36}\/[a-zA-Z0-9…`.
    profileImageUrl: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Apply a custom validation rule.
        .refine(value => /^\/uploads\/labour\/[0-9a-f-]{36}\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/i.test(value) || z.string().url().safeParse(value).success, "Invalid URL for profile image.")
        // Study: Allow this value to be omitted.
        .optional()
        // Study: Accept the alternative value defined by this schema.
        .or(z.literal("")),

    // Study: Set `address` to `z .string() .trim() .max(255, "Address must not exceed 255 characters.") .optional()`.
    address: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 255 here. For text, the limit counts characters.
        .max(255, "Address must not exceed 255 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `emergencyContactName` to `z .string() .trim() .max(150, "Emergency contact name must not exceed 150 character…`.
    emergencyContactName: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 150 here. For text, the limit counts characters.
        .max(150, "Emergency contact name must not exceed 150 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `emergencyContactPhone` to `z .string() .trim() .max(50, "Emergency contact phone must not exceed 50 characters…`.
    emergencyContactPhone: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 50 here. For text, the limit counts characters.
        .max(50, "Emergency contact phone must not exceed 50 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `joiningDate` to `z .coerce.date() .optional()`.
    joiningDate: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Check `status` using the rule `z.enum(["ACTIVE", "INACTIVE"], { message: "Invalid status. Must be ACTIVE or INACTI…`.
    status: z.enum(["ACTIVE", "INACTIVE"], {
        // Study: Set `message` to `"Invalid status. Must be ACTIVE or INACTIVE."`.
        message: "Invalid status. Must be ACTIVE or INACTIVE.",
    // Study: Finish this group and continue the surrounding step.
    }).optional(),

    // Study: Set `notes` to `z .string() .trim() .optional()`.
    notes: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Allow this value to be omitted.
        .optional(),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `labourIdSchema`.
export const labourIdSchema = z.object({
    // Study: Check `id` using the rule `z.string().uuid("Invalid labour ID.")`.
    id: z.string().uuid("Invalid labour ID."),
// Study: End this group of values.
});
