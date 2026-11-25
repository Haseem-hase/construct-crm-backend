// Study: Use Zod to parse and validate inputs for customer accounts and parent-child customer relationships.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";

// Study: Build a Zod validation rule with `z.string().trim().refine` and store the result as `customerProfileImageUrl`.
const customerProfileImageUrl = z.string().trim().refine(
    // Study: Accept `value`.
    value => /^\/uploads\/customers\/[0-9a-f-]{36}\/[a-zA-Z0-9-]+\.(jpg|png|webp)$/i.test(value),
    // Study: Supply the literal string `"Upload a JPEG, PNG, or WebP customer photo."` here.
    "Upload a JPEG, PNG, or WebP customer photo.",
// Study: Close the call arguments.
);

// Study: Build a Zod validation rule with `z.object` and store the result as `createCustomerSchema`.
export const createCustomerSchema = z.object({
    // Study: Set `name` to `z .string() .trim() .min(2, "Customer name must be at least 2 characters.") .max(15…`.
    name: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(2, "Customer name must be at least 2 characters.")
        // Study: Enforce a maximum value or length.
        .max(150, "Customer name must not exceed 150 characters."),

    // Study: Validate `type` with `z.enum(["COMPANY", "GOVERNMENT", "INDIVIDUAL", "OTHER"], { message: "Invalid custom…`.
    type: z.enum(["COMPANY", "GOVERNMENT", "INDIVIDUAL", "OTHER"], {
        // Study: Set `message` to `"Invalid customer type."`.
        message: "Invalid customer type.",
    // Study: Close the object literal.
    }),

    // Study: Set `profileImageUrl` to `customerProfileImageUrl.optional()`.
    profileImageUrl: customerProfileImageUrl.optional(),

    // Study: Set `country` to `z .string() .trim() .max(100, "Country must not exceed 100 characters.")`.
    country: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(100, "Country must not exceed 100 characters."),

    // Study: Set `city` to `z .string() .trim() .max(100, "City must not exceed 100 characters.")`.
    city: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
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

    // Study: Set `parentCustomerId` to `z .string() .uuid("Invalid parent customer ID.") .optional()`.
    parentCustomerId: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Continue the chain with `uuid`.
        .uuid("Invalid parent customer ID.")
        // Study: Allow this value to be omitted.
        .optional(),
// Study: Close the object literal.
});


// Study: Build a Zod validation rule with `z.object` and store the result as `updateCustomerSchema`.
export const updateCustomerSchema = z.object({
    // Study: Set `name` to `z .string() .trim() .min(2, "Customer name must be at least 2 characters.") .max(15…`.
    name: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(2, "Customer name must be at least 2 characters.")
        // Study: Enforce a maximum value or length.
        .max(150, "Customer name must not exceed 150 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Validate `type` with `z.enum(["COMPANY", "GOVERNMENT", "INDIVIDUAL", "OTHER"], { message: "Invalid custom…`.
    type: z.enum(["COMPANY", "GOVERNMENT", "INDIVIDUAL", "OTHER"], {
        // Study: Set `message` to `"Invalid customer type."`.
        message: "Invalid customer type.",
    // Study: Close this group and continue the enclosing expression.
    }).optional(),

    // Study: Set `profileImageUrl` to `customerProfileImageUrl.optional().or(z.literal(""))`.
    profileImageUrl: customerProfileImageUrl.optional().or(z.literal("")),

    // Study: Set `country` to `z .string() .trim() .max(100, "Country must not exceed 100 characters.") .optional()`.
    country: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(100, "Country must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `city` to `z .string() .trim() .max(100, "City must not exceed 100 characters.") .optional()`.
    city: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
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

    // Study: Set `parentCustomerId` to `z .string() .uuid("Invalid parent customer ID.") .optional()`.
    parentCustomerId: z
        // Study: Continue the chain with `string`.
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
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `customerIdSchema`.
export const customerIdSchema = z.object({
    // Study: Validate `id` with `z.string().uuid("Invalid customer ID.")`.
    id: z.string().uuid("Invalid customer ID."),
// Study: Close the object literal.
});
