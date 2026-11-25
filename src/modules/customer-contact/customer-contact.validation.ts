// Study: This file is about the people you can contact at a customer account. Checks whether incoming information is complete and in the expected form.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";

// Study: Set up a check for incoming information using `z.object` and store the result as `createCustomerContactSchema`.
export const createCustomerContactSchema = z.object({
    // Study: Set `name` to `z .string() .trim() .min(2, "Contact name must be at least 2 characters.") .max(150…`.
    name: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 2 here. For text, the limit counts characters.
        .min(2, "Contact name must be at least 2 characters.")
        // Study: Require at most 150 here. For text, the limit counts characters.
        .max(150, "Contact name must not exceed 150 characters."),

    // Study: Set `designation` to `z .string() .trim() .min(2, "Designation must be at least 2 characters.") .max(100,…`.
    designation: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 2 here. For text, the limit counts characters.
        .min(2, "Designation must be at least 2 characters.")
        // Study: Require at most 100 here. For text, the limit counts characters.
        .max(100, "Designation must not exceed 100 characters."),

    // Study: Set `phone` to `z .string() .trim() .min(1, "Phone number must not be empty.") .max(30, "Phone numb…`.
    phone: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 1 here. For text, the limit counts characters.
        .min(1, "Phone number must not be empty.")
        // Study: Require at most 30 here. For text, the limit counts characters.
        .max(30, "Phone number must not exceed 30 characters."),

    // Study: Set `otherPhone` to `z .string() .trim() .max(30, "Other phone number must not exceed 30 characters.") .…`.
    otherPhone: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 30 here. For text, the limit counts characters.
        .max(30, "Other phone number must not exceed 30 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `email` to `z .string() .trim() .email("Invalid email address.") .max(255, "Email must not exce…`.
    email: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Continue the chain with `email`.
        .email("Invalid email address.")
        // Study: Require at most 255 here. For text, the limit counts characters.
        .max(255, "Email must not exceed 255 characters."),

    // Study: Set `profileImageUrl` to `z .string() .trim() .url("Invalid URL for profile image.") .max(500, "Profile image…`.
    profileImageUrl: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Continue the chain with `url`.
        .url("Invalid URL for profile image.")
        // Study: Require at most 500 here. For text, the limit counts characters.
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
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `updateCustomerContactSchema`.
export const updateCustomerContactSchema = z.object({
    // Study: Set `name` to `z .string() .trim() .min(2, "Contact name must be at least 2 characters.") .max(150…`.
    name: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 2 here. For text, the limit counts characters.
        .min(2, "Contact name must be at least 2 characters.")
        // Study: Require at most 150 here. For text, the limit counts characters.
        .max(150, "Contact name must not exceed 150 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `designation` to `z .string() .trim() .min(2, "Designation must be at least 2 characters.") .max(100,…`.
    designation: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 2 here. For text, the limit counts characters.
        .min(2, "Designation must be at least 2 characters.")
        // Study: Require at most 100 here. For text, the limit counts characters.
        .max(100, "Designation must not exceed 100 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `phone` to `z .string() .trim() .min(1, "Phone number must not be empty.") .max(30, "Phone numb…`.
    phone: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 1 here. For text, the limit counts characters.
        .min(1, "Phone number must not be empty.")
        // Study: Require at most 30 here. For text, the limit counts characters.
        .max(30, "Phone number must not exceed 30 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `otherPhone` to `z .string() .trim() .max(30, "Other phone number must not exceed 30 characters.") .…`.
    otherPhone: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at most 30 here. For text, the limit counts characters.
        .max(30, "Other phone number must not exceed 30 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `email` to `z .string() .trim() .email("Invalid email address.") .max(255, "Email must not exce…`.
    email: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Continue the chain with `email`.
        .email("Invalid email address.")
        // Study: Require at most 255 here. For text, the limit counts characters.
        .max(255, "Email must not exceed 255 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `profileImageUrl` to `z .string() .trim() .url("Invalid URL for profile image.") .max(500, "Profile image…`.
    profileImageUrl: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Continue the chain with `url`.
        .url("Invalid URL for profile image.")
        // Study: Require at most 500 here. For text, the limit counts characters.
        .max(500, "Profile image URL must not exceed 500 characters.")
        // Study: Allow this value to be omitted.
        .optional(),

    // Study: Set `isPrimary` to `z .boolean() .optional()`.
    isPrimary: z
        // Study: Continue the chain with `boolean`.
        .boolean()
        // Study: Allow this value to be omitted.
        .optional(),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `contactIdSchema`.
export const contactIdSchema = z.object({
    // Study: Check `contactId` using the rule `z.string().uuid("Invalid contact ID.")`.
    contactId: z.string().uuid("Invalid contact ID."),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `customerAndContactIdParamsSchema`.
export const customerAndContactIdParamsSchema = z.object({
    // Study: Check `customerId` using the rule `z.string().uuid("Invalid customer ID.")`.
    customerId: z.string().uuid("Invalid customer ID."),
    // Study: Check `contactId` using the rule `z.string().uuid("Invalid contact ID.")`.
    contactId: z.string().uuid("Invalid contact ID."),
// Study: End this group of values.
});
