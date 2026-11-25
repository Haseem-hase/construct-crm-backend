// Study: This file is about the companies using the CRM and the people who own their accounts. Checks whether incoming information is complete and in the expected form.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";

// Study: Call `z .object({ organizationName: z .string() .trim() .min(2, "Organization name must b…` and store the result as `registerOrganizationSchema`.
export const registerOrganizationSchema = z
  // Study: Continue the chain with `object`.
  .object({
    // Study: Set `organizationName` to `z .string() .trim() .min(2, "Organization name must be at least 2 characters.") .ma…`.
    organizationName: z
      // Study: Require this value to be text.
      .string()
      // Study: Remove extra spaces at the beginning and end of the text.
      .trim()
      // Study: Require at least 2 here. For text, the limit counts characters.
      .min(2, "Organization name must be at least 2 characters.")
      // Study: Require at most 150 here. For text, the limit counts characters.
      .max(150, "Organization name must not exceed 150 characters."),

    // Study: Set `fullName` to `z .string() .trim() .min(3, "Full name must be at least 3 characters.") .max(100, "…`.
    fullName: z
      // Study: Require this value to be text.
      .string()
      // Study: Remove extra spaces at the beginning and end of the text.
      .trim()
      // Study: Require at least 3 here. For text, the limit counts characters.
      .min(3, "Full name must be at least 3 characters.")
      // Study: Require at most 100 here. For text, the limit counts characters.
      .max(100, "Full name must not exceed 100 characters."),

    // Study: Set `email` to `z .email("Invalid email address.") .trim() .toLowerCase()`.
    email: z
      // Study: Continue the chain with `email`.
      .email("Invalid email address.")
      // Study: Remove extra spaces at the beginning and end of the text.
      .trim()
      // Study: Continue the chain with `toLowerCase`.
      .toLowerCase(),

    // Study: Set `phone` to `z .string() .trim() .min(8, "Phone number must be at least 8 characters.") .max(20,…`.
    phone: z
      // Study: Require this value to be text.
      .string()
      // Study: Remove extra spaces at the beginning and end of the text.
      .trim()
      // Study: Require at least 8 here. For text, the limit counts characters.
      .min(8, "Phone number must be at least 8 characters.")
      // Study: Require at most 20 here. For text, the limit counts characters.
      .max(20, "Phone number must not exceed 20 characters."),

    // Study: Set `password` to `z .string() .min(8, "Password must be at least 8 characters.")`.
    password: z
      // Study: Require this value to be text.
      .string()
      // Study: Require at least 8 here. For text, the limit counts characters.
      .min(8, "Password must be at least 8 characters."),

    // Study: Check `confirmPassword` using the rule `z.string()`.
    confirmPassword: z.string(),
  // Study: End this group of values.
  })
  // Study: Apply a custom validation rule.
  .refine((data) => data.password === data.confirmPassword, {
    // Study: Set `message` to `"Passwords do not match."`.
    message: "Passwords do not match.",
    // Study: Start the nested value for `path`.
    path: ["confirmPassword"],
  // Study: End this group of values.
  });

// Study: Call `registerOrganizationSchema .safeExtend({ description: z.string().trim().optional(),…` and store the result as `createOrganizationSchema`.
export const createOrganizationSchema = registerOrganizationSchema
  // Study: Continue the chain with `safeExtend`.
  .safeExtend({
    // Study: Check `description` using the rule `z.string().trim().optional()`.
    description: z.string().trim().optional(),
  // Study: End this group of values.
  })
  // Study: Continue the chain with `strict`.
  .strict();

// Study: Call `z .object({ search: z.string().trim().max(150, "Search must not exceed 150 characte…` and store the result as `listOrganizationsQuerySchema`.
export const listOrganizationsQuerySchema = z
  // Study: Continue the chain with `object`.
  .object({
    // Study: Check `search` using the rule `z.string().trim().max(150, "Search must not exceed 150 characters.").optional()`.
    search: z.string().trim().max(150, "Search must not exceed 150 characters.").optional(),
    // Study: Check `page` using the rule `z.coerce.number().int().min(1).max(1_000_000).default(1)`.
    page: z.coerce.number().int().min(1).max(1_000_000).default(1),
    // Study: Check `pageSize` using the rule `z.coerce.number().int().min(1).max(100).default(10)`.
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
  // Study: End this group of values.
  })
  // Study: Continue the chain with `strict`.
  .strict();
