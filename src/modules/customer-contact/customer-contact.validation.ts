// Study: Use Zod to parse and validate inputs for contacts attached to customer accounts.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";

// Study: Build a Zod validation rule with `z.object` and store the result as `createCustomerContactSchema`.
export const createCustomerContactSchema = z.object({
    // Study: Set `name` to `z .string() .trim() .min(2, "Contact name must be at least 2 characters.") .max(150…`.
    name: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(2, "Contact name must be at least 2 characters.")
        // Study: Enforce a maximum value or length.
        .max(150, "Contact name must not exceed 150 characters."),

    // Study: Set `designation` to `z .string() .trim() .min(2, "Designation must be at least 2 characters.") .max(100,…`.
    designation: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(2, "Designation must be at least 2 characters.")
        // Study: Enforce a maximum value or length.
        .max(100, "Designation must not exceed 100 characters."),

    // Study: Set `phone` to `z .string() .trim() .min(1, "Phone number must not be empty.") .max(30, "Phone numb…`.
    phone: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(1, "Phone number must not be empty.")
        // Study: Enforce a maximum value or length.
        .max(30, "Phone number must not exceed 30 characters."),

    // Study: Set `otherPhone` to `z .string() .trim() .max(30, "Other phone number must not exceed 30 characters.") .…`.
    otherPhone: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(30, "Other phone number must not exceed 30 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `email` to `z .string() .trim() .email("Invalid email address.") .max(255, "Email must not exce…`.
    email: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Continue the chain with `email`.
        .email("Invalid email address.")
        // Study: Enforce a maximum value or length.
        .max(255, "Email must not exceed 255 characters."),

    // Study: Set `profileImageUrl` to `z .string() .trim() .url("Invalid URL for profile image.") .max(500, "Profile image…`.
    profileImageUrl: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Continue the chain with `url`.
        .url("Invalid URL for profile image.")
        // Study: Enforce a maximum value or length.
        .max(500, "Profile image URL must not exceed 500 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `isPrimary` to `z .boolean() .optional() .default(false)`.
    isPrimary: z
        // Study: Continue the chain with `boolean`.
        .boolean()
        // Study: Allow this value to be omitted.
        .optional()
        // Study: Use this default when no value is provided.
        .default(false),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `updateCustomerContactSchema`.
export const updateCustomerContactSchema = z.object({
    // Study: Set `name` to `z .string() .trim() .min(2, "Contact name must be at least 2 characters.") .max(150…`.
    name: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(2, "Contact name must be at least 2 characters.")
        // Study: Enforce a maximum value or length.
        .max(150, "Contact name must not exceed 150 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `designation` to `z .string() .trim() .min(2, "Designation must be at least 2 characters.") .max(100,…`.
    designation: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(2, "Designation must be at least 2 characters.")
        // Study: Enforce a maximum value or length.
        .max(100, "Designation must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `phone` to `z .string() .trim() .min(1, "Phone number must not be empty.") .max(30, "Phone numb…`.
    phone: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(1, "Phone number must not be empty.")
        // Study: Enforce a maximum value or length.
        .max(30, "Phone number must not exceed 30 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `otherPhone` to `z .string() .trim() .max(30, "Other phone number must not exceed 30 characters.") .…`.
    otherPhone: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a maximum value or length.
        .max(30, "Other phone number must not exceed 30 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `email` to `z .string() .trim() .email("Invalid email address.") .max(255, "Email must not exce…`.
    email: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Continue the chain with `email`.
        .email("Invalid email address.")
        // Study: Enforce a maximum value or length.
        .max(255, "Email must not exceed 255 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `profileImageUrl` to `z .string() .trim() .url("Invalid URL for profile image.") .max(500, "Profile image…`.
    profileImageUrl: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Continue the chain with `url`.
        .url("Invalid URL for profile image.")
        // Study: Enforce a maximum value or length.
        .max(500, "Profile image URL must not exceed 500 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `isPrimary` to `z .boolean() .optional()`.
    isPrimary: z
        // Study: Continue the chain with `boolean`.
        .boolean()
        // Study: Allow this value to be omitted.
        .optional(),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `contactIdSchema`.
export const contactIdSchema = z.object({
    // Study: Validate `contactId` with `z.string().uuid("Invalid contact ID.")`.
    contactId: z.string().uuid("Invalid contact ID."),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `customerAndContactIdParamsSchema`.
export const customerAndContactIdParamsSchema = z.object({
    // Study: Validate `customerId` with `z.string().uuid("Invalid customer ID.")`.
    customerId: z.string().uuid("Invalid customer ID."),
    // Study: Validate `contactId` with `z.string().uuid("Invalid contact ID.")`.
    contactId: z.string().uuid("Invalid contact ID."),
// Study: Close the object literal.
});
