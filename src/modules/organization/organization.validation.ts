import { z } from "zod";

export const registerOrganizationSchema = z
  .object({
    organizationName: z
      .string()
      .trim()
      .min(2, "Organization name must be at least 2 characters.")
      .max(150, "Organization name must not exceed 150 characters."),

    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters.")
      .max(100, "Full name must not exceed 100 characters."),

    email: z
      .email("Invalid email address.")
      .trim()
      .toLowerCase(),

    phone: z
      .string()
      .trim()
      .min(8, "Phone number must be at least 8 characters.")
      .max(20, "Phone number must not exceed 20 characters."),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const createOrganizationSchema = registerOrganizationSchema
  .safeExtend({
    description: z.string().trim().optional(),
  })
  .strict();

export const listOrganizationsQuerySchema = z
  .object({
    search: z.string().trim().max(150, "Search must not exceed 150 characters.").optional(),
    page: z.coerce.number().int().min(1).max(1_000_000).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(10),
  })
  .strict();
