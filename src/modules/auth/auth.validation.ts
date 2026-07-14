import { z } from "zod";

export const registerCustomerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(3, "Full name must be at least 3 characters.")
      .max(100),

    email: z
      .email("Invalid email address.")
      .trim()
      .toLowerCase(),

    phone: z
      .string()
      .trim()
      .min(8)
      .max(20),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters."),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });