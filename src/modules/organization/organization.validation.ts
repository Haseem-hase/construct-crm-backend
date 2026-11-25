// Study: Use Zod to parse and validate inputs for organizations and their owners.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";

// Study: Call `z .object({ organizationName: z .string() .trim() .min(2, "Organization name must b…` and store the result as `registerOrganizationSchema`.
export const registerOrganizationSchema = z
  // Study: Continue the chain with `object`.
  .object({
    // Study: Set `organizationName` to `z .string() .trim() .min(2, "Organization name must be at least 2 characters.") .ma…`.
    organizationName: z
      // Study: Continue the chain with `string`.
      .string()
      // Study: Remove surrounding whitespace.
      .trim()
      // Study: Enforce a minimum value or length.
      .min(2, "Organization name must be at least 2 characters.")
      // Study: Enforce a maximum value or length.
      .max(150, "Organization name must not exceed 150 characters."),

    // Study: Set `fullName` to `z .string() .trim() .min(3, "Full name must be at least 3 characters.") .max(100, "…`.
    fullName: z
      // Study: Continue the chain with `string`.
      .string()
      // Study: Remove surrounding whitespace.
      .trim()
      // Study: Enforce a minimum value or length.
      .min(3, "Full name must be at least 3 characters.")
      // Study: Enforce a maximum value or length.
      .max(100, "Full name must not exceed 100 characters."),

    // Study: Set `email` to `z .email("Invalid email address.") .trim() .toLowerCase()`.
    email: z
      // Study: Continue the chain with `email`.
      .email("Invalid email address.")
      // Study: Remove surrounding whitespace.
      .trim()
      // Study: Continue the chain with `toLowerCase`.
      .toLowerCase(),

    // Study: Set `phone` to `z .string() .trim() .min(8, "Phone number must be at least 8 characters.") .max(20,…`.
    phone: z
      // Study: Continue the chain with `string`.
      .string()
      // Study: Remove surrounding whitespace.
      .trim()
      // Study: Enforce a minimum value or length.
      .min(8, "Phone number must be at least 8 characters.")
      // Study: Enforce a maximum value or length.
      .max(20, "Phone number must not exceed 20 characters."),

    // Study: Set `password` to `z .string() .min(8, "Password must be at least 8 characters.")`.
    password: z
      // Study: Continue the chain with `string`.
      .string()
      // Study: Enforce a minimum value or length.
      .min(8, "Password must be at least 8 characters."),

    // Study: Validate `confirmPassword` with `z.string()`.
    confirmPassword: z.string(),
  // Study: Close the object literal.
  })
  // Study: Apply a custom validation rule.
  .refine((data) => data.password === data.confirmPassword, {
    // Study: Set `message` to `"Passwords do not match."`.
    message: "Passwords do not match.",
    // Study: Start the nested value for `path`.
    path: ["confirmPassword"],
  // Study: Close the object literal.
  });

// Study: Call `registerOrganizationSchema .safeExtend({ description: z.string().trim().optional(),…` and store the result as `createOrganizationSchema`.
export const createOrganizationSchema = registerOrganizationSchema
  // Study: Continue the chain with `safeExtend`.
  .safeExtend({
    // Study: Validate `description` with `z.string().trim().optional()`.
    description: z.string().trim().optional(),
  // Study: Close the object literal.
  })
  // Study: Continue the chain with `strict`.
  .strict();

// Study: Call `z .object({ search: z.string().trim().max(150, "Search must not exceed 150 characte…` and store the result as `listOrganizationsQuerySchema`.
export const listOrganizationsQuerySchema = z
  // Study: Continue the chain with `object`.
  .object({
    // Study: Validate `search` with `z.string().trim().max(150, "Search must not exceed 150 characters.").optional()`.
    search: z.string().trim().max(150, "Search must not exceed 150 characters.").optional(),
    // Study: Validate `page` with `z.coerce.number().int().min(1).max(1_000_000).default(1)`.
    page: z.coerce.number().int().min(1).max(1_000_000).default(1),
    // Study: Validate `pageSize` with `z.coerce.number().int().min(1).max(100).default(10)`.
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
  // Study: Close the object literal.
  })
  // Study: Continue the chain with `strict`.
  .strict();
