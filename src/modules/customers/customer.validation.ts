// Study: This file is about customer accounts and which customers belong under a parent customer. Checks whether incoming information is complete and in the expected form.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";

// Study: Set up a check for incoming information using `z.string().trim().refine` and store the result as `customerProfileImageUrl`.
const customerProfileImageUrl = z.string().trim().refine(
    // Study: Accept `value`.
    value => /^\/uploads\/customers\/[0-9a-f-]{36}\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/i.test(value),
    // Study: Supply the literal string `"Upload a JPEG, PNG, or WebP customer photo."` here.
    "Upload a JPEG, PNG, or WebP customer photo.",
// Study: End the list of information being sent to this step.
);

// Study: Set up a check for incoming information using `z.object` and store the result as `createCustomerSchema`.
export const createCustomerSchema = z.object({
    // Study: Set `name` to `z .string() .trim() .min(2, "Customer name must be at least 2 characters.") .max(15…`.
    name: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 2 here. For text, the limit counts characters.
        .min(2, "Customer name must be at least 2 characters.")
        // Study: Require at most 150 here. For text, the limit counts characters.
        .max(150, "Customer name must not exceed 150 characters."),

    // Study: Check `type` using the rule `z.enum(["COMPANY", "GOVERNMENT", "INDIVIDUAL", "OTHER"], { message: "Invalid custom…`.
    type: z.enum(["COMPANY", "GOVERNMENT", "INDIVIDUAL", "OTHER"], {
        // Study: Set `message` to `"Invalid customer type."`.
        message: "Invalid customer type.",
    // Study: End this group of values.
    }),

    // Study: Set `profileImageUrl` to `customerProfileImageUrl.optional()`.
    profileImageUrl: customerProfileImageUrl.optional(),

    // Study: Set `country` to `z .string() .trim() .max(100, "Country must not exceed 100 characters.")`.
    country: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 100 here. For text, the limit counts characters.
        .max(100, "Country must not exceed 100 characters."),

    // Study: Set `city` to `z .string() .trim() .max(100, "City must not exceed 100 characters.")`.
    city: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
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

    // Study: Set `parentCustomerId` to `z .string() .uuid("Invalid parent customer ID.") .optional()`.
    parentCustomerId: z
        // Study: Require this value to be text.
        .string()
        // Study: Continue the chain with `uuid`.
        .uuid("Invalid parent customer ID.")
        // Study: Allow this value to be omitted.
        .optional(),
// Study: End this group of values.
});


// Study: Set up a check for incoming information using `z.object` and store the result as `updateCustomerSchema`.
export const updateCustomerSchema = z.object({
    // Study: Set `name` to `z .string() .trim() .min(2, "Customer name must be at least 2 characters.") .max(15…`.
    name: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 2 here. For text, the limit counts characters.
        .min(2, "Customer name must be at least 2 characters.")
        // Study: Require at most 150 here. For text, the limit counts characters.
        .max(150, "Customer name must not exceed 150 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Check `type` using the rule `z.enum(["COMPANY", "GOVERNMENT", "INDIVIDUAL", "OTHER"], { message: "Invalid custom…`.
    type: z.enum(["COMPANY", "GOVERNMENT", "INDIVIDUAL", "OTHER"], {
        // Study: Set `message` to `"Invalid customer type."`.
        message: "Invalid customer type.",
    // Study: Finish this group and continue the surrounding step.
    }).optional(),

    // Study: Set `profileImageUrl` to `customerProfileImageUrl.optional().or(z.literal(""))`.
    profileImageUrl: customerProfileImageUrl.optional().or(z.literal("")),

    // Study: Set `country` to `z .string() .trim() .max(100, "Country must not exceed 100 characters.") .optional()`.
    country: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 100 here. For text, the limit counts characters.
        .max(100, "Country must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `city` to `z .string() .trim() .max(100, "City must not exceed 100 characters.") .optional()`.
    city: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
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

    // Study: Set `parentCustomerId` to `z .string() .uuid("Invalid parent customer ID.") .optional()`.
    parentCustomerId: z
        // Study: Require this value to be text.
        .string()
        // Study: Continue the chain with `uuid`.
        .uuid("Invalid parent customer ID.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `isActive` to `z .preprocess(value => typeof value === "string" ? value === "true" : value, z.bool…`.
    isActive: z
        // Study: Continue the chain with `preprocess`.
        .preprocess(value => typeof value === "string" ? value === "true" : value, z.boolean())
        // Study: Allow this value to be omitted.
        .optional(),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `customerIdSchema`.
export const customerIdSchema = z.object({
    // Study: Check `id` using the rule `z.string().uuid("Invalid customer ID.")`.
    id: z.string().uuid("Invalid customer ID."),
// Study: End this group of values.
});
