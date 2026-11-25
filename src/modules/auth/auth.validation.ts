// Study: Use Zod to parse and validate inputs for account registration, sign-in, sign-out, and session token refresh.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";

// Study: Call `z .object({ fullName: z .string() .trim() .min(3, "Full name must be at least 3 cha…` and store the result as `registerCustomerSchema`.
export const registerCustomerSchema = z
  // Study: Continue the chain with `object`.
  .object({
    // Study: Set `fullName` to `z .string() .trim() .min(3, "Full name must be at least 3 characters.") .max(100)`.
    fullName: z
      // Study: Continue the chain with `string`.
      .string()
      // Study: Remove surrounding whitespace.
      .trim()
      // Study: Enforce a minimum value or length.
      .min(3, "Full name must be at least 3 characters.")
      // Study: Enforce a maximum value or length.
      .max(100),

    // Study: Set `email` to `z .email("Invalid email address.") .trim() .toLowerCase()`.
    email: z
      // Study: Continue the chain with `email`.
      .email("Invalid email address.")
      // Study: Remove surrounding whitespace.
      .trim()
      // Study: Continue the chain with `toLowerCase`.
      .toLowerCase(),

    // Study: Set `phone` to `z .string() .trim() .min(8) .max(20)`.
    phone: z
      // Study: Continue the chain with `string`.
      .string()
      // Study: Remove surrounding whitespace.
      .trim()
      // Study: Enforce a minimum value or length.
      .min(8)
      // Study: Enforce a maximum value or length.
      .max(20),

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

// Study: Build a Zod validation rule with `z.object` and store the result as `loginSchema`.
export const loginSchema = z.object({
    // Study: Set `email` to `z .string() .trim() .email("Invalid email address.")`.
    email: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Continue the chain with `email`.
        .email("Invalid email address."),

    // Study: Set `password` to `z .string() .trim() .min(8, "Password must be at least 8 characters long.")`.
    password: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(8, "Password must be at least 8 characters long."),
// Study: Close the object literal.
});

// Study: Build a Zod validation rule with `z.object` and store the result as `refreshTokenSchema`.
export const refreshTokenSchema = z.object({
    // Study: Set `refreshToken` to `z .string() .trim() .min(1, "Refresh token is required.")`.
    refreshToken: z
        // Study: Continue the chain with `string`.
        .string()
        // Study: Remove surrounding whitespace.
        .trim()
        // Study: Enforce a minimum value or length.
        .min(1, "Refresh token is required."),
// Study: Close the object literal.
});