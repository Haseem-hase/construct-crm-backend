// Study: Use Zod to parse and validate inputs for contractor records.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";

// Study: Build a Zod validation rule with `z.object` and store the result as `createContractorSchema`.
export const createContractorSchema = z.object({
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

    // Study: Set `alternativePhone` to `z .string() .trim() .max(50, "Alternative phone number must not exceed 50 character…`.
    alternativePhone: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(50, "Alternative phone number must not exceed 50 characters.")
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

    // Study: Set `profileImageUrl` to `z .string() .trim() .refine(value => /^\/uploads\/contractors\/[0-9a-f-]{36}\/[a-zA…`.
    profileImageUrl: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Apply a custom validation rule.
        .refine(value => /^\/uploads\/contractors\/[0-9a-f-]{36}\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/i.test(value) || z.string().url().safeParse(value).success, "Invalid URL for profile image.")
        // Study: Allow this value to be omitted.
        .optional()
        // Study: Accept the alternative value defined by this schema.
        .or(z.literal("")),

    // Study: Set `nationalId` to `z .string() .trim() .max(100, "National ID must not exceed 100 characters.") .optio…`.
    nationalId: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(100, "National ID must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `licenseNumber` to `z .string() .trim() .max(100, "License number must not exceed 100 characters.") .op…`.
    licenseNumber: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(100, "License number must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `licenseExpiryDate` to `z .coerce.date() .optional()`.
    licenseExpiryDate: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Validate `status` with `z.enum(["PENDING", "ACTIVE", "SUSPENDED", "INACTIVE", "TERMINATED"], { message: "In…`.
    status: z.enum(["PENDING", "ACTIVE", "SUSPENDED", "INACTIVE", "TERMINATED"], {
        // Study: Set `message` to `"Invalid status."`.
        message: "Invalid status.",
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

// Study: Build a Zod validation rule with `z.object` and store the result as `updateContractorSchema`.
export const updateContractorSchema = z.object({
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

    // Study: Set `alternativePhone` to `z .string() .trim() .max(50, "Alternative phone number must not exceed 50 character…`.
    alternativePhone: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(50, "Alternative phone number must not exceed 50 characters.")
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

    // Study: Set `profileImageUrl` to `z .string() .trim() .refine(value => /^\/uploads\/contractors\/[0-9a-f-]{36}\/[a-zA…`.
    profileImageUrl: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Apply a custom validation rule.
        .refine(value => /^\/uploads\/contractors\/[0-9a-f-]{36}\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/i.test(value) || z.string().url().safeParse(value).success, "Invalid URL for profile image.")
        // Study: Allow this value to be omitted.
        .optional()
        // Study: Accept the alternative value defined by this schema.
        .or(z.literal("")),

    // Study: Set `nationalId` to `z .string() .trim() .max(100, "National ID must not exceed 100 characters.") .optio…`.
    nationalId: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(100, "National ID must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `licenseNumber` to `z .string() .trim() .max(100, "License number must not exceed 100 characters.") .op…`.
    licenseNumber: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(100, "License number must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `licenseExpiryDate` to `z .preprocess(value => value === "" ? null : value, z.coerce.date().nullable()) .op…`.
    licenseExpiryDate: z
        // Study: Continue the chain with `preprocess`.
        .preprocess(value => value === "" ? null : value, z.coerce.date().nullable())
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Validate `status` with `z.enum(["PENDING", "ACTIVE", "SUSPENDED", "INACTIVE", "TERMINATED"], { message: "In…`.
    status: z.enum(["PENDING", "ACTIVE", "SUSPENDED", "INACTIVE", "TERMINATED"], {
        // Study: Set `message` to `"Invalid status."`.
        message: "Invalid status.",
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

// Study: Build a Zod validation rule with `z.object` and store the result as `contractorIdSchema`.
export const contractorIdSchema = z.object({
    // Study: Validate `id` with `z.string().uuid("Invalid contractor ID.")`.
    id: z.string().uuid("Invalid contractor ID."),
// Study: Close the object literal.
});
