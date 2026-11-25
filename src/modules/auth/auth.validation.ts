// Study: This file is about signing in, signing out, creating an account, and staying signed in. Checks whether incoming information is complete and in the expected form.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";

// Study: Call `z .object({ fullName: z .string() .trim() .min(3, "Full name must be at least 3 cha…` and store the result as `registerCustomerSchema`.
export const registerCustomerSchema = z
  // Study: Continue the chain with `object`.
  .object({
    // Study: Set `fullName` to `z .string() .trim() .min(3, "Full name must be at least 3 characters.") .max(100)`.
    fullName: z
      // Study: Require this value to be text.
      .string()
      // Study: Remove extra spaces at the beginning and end of the text.
      .trim()
      // Study: Require at least 3 here. For text, the limit counts characters.
      .min(3, "Full name must be at least 3 characters.")
      // Study: Require at most 100 here. For text, the limit counts characters.
      .max(100),

    // Study: Set `email` to `z .email("Invalid email address.") .trim() .toLowerCase()`.
    email: z
      // Study: Continue the chain with `email`.
      .email("Invalid email address.")
      // Study: Remove extra spaces at the beginning and end of the text.
      .trim()
      // Study: Continue the chain with `toLowerCase`.
      .toLowerCase(),

    // Study: Set `phone` to `z .string() .trim() .min(8) .max(20)`.
    phone: z
      // Study: Require this value to be text.
      .string()
      // Study: Remove extra spaces at the beginning and end of the text.
      .trim()
      // Study: Require at least 8 here. For text, the limit counts characters.
      .min(8)
      // Study: Require at most 20 here. For text, the limit counts characters.
      .max(20),

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

// Study: Set up a check for incoming information using `z.object` and store the result as `loginSchema`.
export const loginSchema = z.object({
    // Study: Set `email` to `z .string() .trim() .email("Invalid email address.")`.
    email: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Continue the chain with `email`.
        .email("Invalid email address."),

    // Study: Set `password` to `z .string() .trim() .min(8, "Password must be at least 8 characters long.")`.
    password: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 8 here. For text, the limit counts characters.
        .min(8, "Password must be at least 8 characters long."),
// Study: End this group of values.
});

// Study: Set up a check for incoming information using `z.object` and store the result as `refreshTokenSchema`.
export const refreshTokenSchema = z.object({
    // Study: Set `refreshToken` to `z .string() .trim() .min(1, "Refresh token is required.")`.
    refreshToken: z
        // Study: Require this value to be text.
        .string()
        // Study: Remove extra spaces at the beginning and end of the text.
        .trim()
        // Study: Require at least 1 here. For text, the limit counts characters.
        .min(1, "Refresh token is required."),
// Study: End this group of values.
});