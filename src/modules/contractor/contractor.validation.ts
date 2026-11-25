// Study: This file is about the details the CRM keeps about contractors. Checks whether incoming information is complete and in the expected form.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";

// Study: Set up a check for incoming information using `z.object` and store the result as `createContractorSchema`.
export const createContractorSchema = z.object({
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

    // Study: Set `alternativePhone` to `z .string() .trim() .max(50, "Alternative phone number must not exceed 50 character…`.
    alternativePhone: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 50 here. For text, the limit counts characters.
        .max(50, "Alternative phone number must not exceed 50 characters.")
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

    // Study: Set `profileImageUrl` to `z .string() .trim() .refine(value => /^\/uploads\/contractors\/[0-9a-f-]{36}\/[a-zA…`.
    profileImageUrl: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Apply a custom validation rule.
        .refine(value => /^\/uploads\/contractors\/[0-9a-f-]{36}\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/i.test(value) || z.string().url().safeParse(value).success, "Invalid URL for profile image.")
        // Study: Allow this value to be omitted.
        .optional()
        // Study: Accept the alternative value defined by this schema.
        .or(z.literal("")),

    // Study: Set `nationalId` to `z .string() .trim() .max(100, "National ID must not exceed 100 characters.") .optio…`.
    nationalId: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 100 here. For text, the limit counts characters.
        .max(100, "National ID must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `licenseNumber` to `z .string() .trim() .max(100, "License number must not exceed 100 characters.") .op…`.
    licenseNumber: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 100 here. For text, the limit counts characters.
        .max(100, "License number must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `licenseExpiryDate` to `z .coerce.date() .optional()`.
    licenseExpiryDate: z
        // Study: Supply `coerce` to the surrounding statement.
        .coerce.date()
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Check `status` using the rule `z.enum(["PENDING", "ACTIVE", "SUSPENDED", "INACTIVE", "TERMINATED"], { message: "In…`.
    status: z.enum(["PENDING", "ACTIVE", "SUSPENDED", "INACTIVE", "TERMINATED"], {
        // Study: Set `message` to `"Invalid status."`.
        message: "Invalid status.",
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

// Study: Set up a check for incoming information using `z.object` and store the result as `updateContractorSchema`.
export const updateContractorSchema = z.object({
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

    // Study: Set `alternativePhone` to `z .string() .trim() .max(50, "Alternative phone number must not exceed 50 character…`.
    alternativePhone: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 50 here. For text, the limit counts characters.
        .max(50, "Alternative phone number must not exceed 50 characters.")
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

    // Study: Set `profileImageUrl` to `z .string() .trim() .refine(value => /^\/uploads\/contractors\/[0-9a-f-]{36}\/[a-zA…`.
    profileImageUrl: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Apply a custom validation rule.
        .refine(value => /^\/uploads\/contractors\/[0-9a-f-]{36}\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/i.test(value) || z.string().url().safeParse(value).success, "Invalid URL for profile image.")
        // Study: Allow this value to be omitted.
        .optional()
        // Study: Accept the alternative value defined by this schema.
        .or(z.literal("")),

    // Study: Set `nationalId` to `z .string() .trim() .max(100, "National ID must not exceed 100 characters.") .optio…`.
    nationalId: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 100 here. For text, the limit counts characters.
        .max(100, "National ID must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `licenseNumber` to `z .string() .trim() .max(100, "License number must not exceed 100 characters.") .op…`.
    licenseNumber: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 100 here. For text, the limit counts characters.
        .max(100, "License number must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `licenseExpiryDate` to `z .preprocess(value => value === "" ? null : value, z.coerce.date().nullable()) .op…`.
    licenseExpiryDate: z
        // Study: Continue the chain with `preprocess`.
        .preprocess(value => value === "" ? null : value, z.coerce.date().nullable())
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Check `status` using the rule `z.enum(["PENDING", "ACTIVE", "SUSPENDED", "INACTIVE", "TERMINATED"], { message: "In…`.
    status: z.enum(["PENDING", "ACTIVE", "SUSPENDED", "INACTIVE", "TERMINATED"], {
        // Study: Set `message` to `"Invalid status."`.
        message: "Invalid status.",
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

// Study: Set up a check for incoming information using `z.object` and store the result as `contractorIdSchema`.
export const contractorIdSchema = z.object({
    // Study: Check `id` using the rule `z.string().uuid("Invalid contractor ID.")`.
    id: z.string().uuid("Invalid contractor ID."),
// Study: End this group of values.
});
