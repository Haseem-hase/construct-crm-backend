// Study: Use Zod to parse and validate inputs for worker records and their professions.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";

// Study: Build a Zod validation rule with `z.object` and store the result as `createLabourSchema`.
export const createLabourSchema = z.object({
    // Study: Set `fullName` to `z .string() .trim() .min(2, "Full name must be at least 2 characters.") .max(150, "…`.
    fullName: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(2, "Full name must be at least 2 characters.")
        // Study: Enforce a maximum value or length.
        .max(150, "Full name must not exceed 150 characters."),

    // Study: Set `phone` to `z .string() .trim() .min(5, "Phone number is too short.") .max(50, "Phone number mu…`.
    phone: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(5, "Phone number is too short.")
        // Study: Enforce a maximum value or length.
        .max(50, "Phone number must not exceed 50 characters."),

    // Study: Set `professionId` to `z .string() .uuid("Invalid profession ID.")`.
    professionId: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Continue the chain with `uuid`.
        .uuid("Invalid profession ID."),

    // Study: Set `country` to `z .string() .trim() .min(2, "Country is required.") .max(100, "Country must not exc…`.
    country: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(2, "Country is required.")
        // Study: Enforce a maximum value or length.
        .max(100, "Country must not exceed 100 characters."),

    // Study: Set `city` to `z .string() .trim() .min(1, "City is required.") .max(100, "City must not exceed 10…`.
    city: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(1, "City is required.")
        // Study: Enforce a maximum value or length.
        .max(100, "City must not exceed 100 characters."),

    // Study: Set `email` to `z .string() .trim() .email("Invalid email address.") .optional() .or(z.literal(""))`.
    email: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
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
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Apply a custom validation rule.
        .refine(value => /^\/uploads\/labour\/[0-9a-f-]{36}\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/i.test(value) || z.string().url().safeParse(value).success, "Invalid URL for profile image.")
        // Study: Allow this value to be omitted.
        .optional()
        // Study: Accept the alternative value defined by this schema.
        .or(z.literal("")),

    // Study: Set `address` to `z .string() .trim() .max(255, "Address must not exceed 255 characters.") .optional()`.
    address: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(255, "Address must not exceed 255 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `emergencyContactName` to `z .string() .trim() .max(150, "Emergency contact name must not exceed 150 character…`.
    emergencyContactName: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(150, "Emergency contact name must not exceed 150 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `emergencyContactPhone` to `z .string() .trim() .max(50, "Emergency contact phone must not exceed 50 characters…`.
    emergencyContactPhone: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(50, "Emergency contact phone must not exceed 50 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `joiningDate` to `z .coerce.date() .optional()`.
    joiningDate: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Validate `status` with `z.enum(["ACTIVE", "INACTIVE"], { message: "Invalid status. Must be ACTIVE or INACTI…`.
    status: z.enum(["ACTIVE", "INACTIVE"], {
        // Study: Set `message` to `"Invalid status. Must be ACTIVE or INACTIVE."`.
        message: "Invalid status. Must be ACTIVE or INACTIVE.",
    // Study: Close this group and continue the enclosing expression.
    }).optional(),

    // Study: Set `notes` to `z .string() .trim() .optional()`.
    notes: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Allow this value to be omitted.
        .optional(),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `updateLabourSchema`.
export const updateLabourSchema = z.object({
    // Study: Set `fullName` to `z .string() .trim() .min(2, "Full name must be at least 2 characters.") .max(150, "…`.
    fullName: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(2, "Full name must be at least 2 characters.")
        // Study: Enforce a maximum value or length.
        .max(150, "Full name must not exceed 150 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `phone` to `z .string() .trim() .min(5, "Phone number is too short.") .max(50, "Phone number mu…`.
    phone: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(5, "Phone number is too short.")
        // Study: Enforce a maximum value or length.
        .max(50, "Phone number must not exceed 50 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `professionId` to `z .string() .uuid("Invalid profession ID.") .optional()`.
    professionId: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Continue the chain with `uuid`.
        .uuid("Invalid profession ID.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `country` to `z .string() .trim() .min(2, "Country is required.") .max(100, "Country must not exc…`.
    country: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(2, "Country is required.")
        // Study: Enforce a maximum value or length.
        .max(100, "Country must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `city` to `z .string() .trim() .min(1, "City is required.") .max(100, "City must not exceed 10…`.
    city: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(1, "City is required.")
        // Study: Enforce a maximum value or length.
        .max(100, "City must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `email` to `z .string() .trim() .email("Invalid email address.") .optional() .or(z.literal(""))`.
    email: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
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
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Apply a custom validation rule.
        .refine(value => /^\/uploads\/labour\/[0-9a-f-]{36}\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/i.test(value) || z.string().url().safeParse(value).success, "Invalid URL for profile image.")
        // Study: Allow this value to be omitted.
        .optional()
        // Study: Accept the alternative value defined by this schema.
        .or(z.literal("")),

    // Study: Set `address` to `z .string() .trim() .max(255, "Address must not exceed 255 characters.") .optional()`.
    address: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(255, "Address must not exceed 255 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `emergencyContactName` to `z .string() .trim() .max(150, "Emergency contact name must not exceed 150 character…`.
    emergencyContactName: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(150, "Emergency contact name must not exceed 150 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `emergencyContactPhone` to `z .string() .trim() .max(50, "Emergency contact phone must not exceed 50 characters…`.
    emergencyContactPhone: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(50, "Emergency contact phone must not exceed 50 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `joiningDate` to `z .coerce.date() .optional()`.
    joiningDate: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Validate `status` with `z.enum(["ACTIVE", "INACTIVE"], { message: "Invalid status. Must be ACTIVE or INACTI…`.
    status: z.enum(["ACTIVE", "INACTIVE"], {
        // Study: Set `message` to `"Invalid status. Must be ACTIVE or INACTIVE."`.
        message: "Invalid status. Must be ACTIVE or INACTIVE.",
    // Study: Close this group and continue the enclosing expression.
    }).optional(),

    // Study: Set `notes` to `z .string() .trim() .optional()`.
    notes: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Allow this value to be omitted.
        .optional(),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `labourIdSchema`.
export const labourIdSchema = z.object({
    // Study: Validate `id` with `z.string().uuid("Invalid labour ID.")`.
    id: z.string().uuid("Invalid labour ID."),
// Study: Close the object literal.
});
