// Study: Define TypeScript data contracts for account registration, sign-in, sign-out, and session token refresh.
// Study: Import `{ z }` from `"zod"`.
import { z } from "zod";
// Study: Import `{ loginSchema, registerCustomerSchema, refreshTokenSchema, }` from `"./auth.validation"`.
import { loginSchema, registerCustomerSchema, refreshTokenSchema, } from "./auth.validation";
// Study: Import `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"`.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";

// Study: Define the compile-time contract named `RegisterCustomerInput` from the Zod schema so the types follow validation.
export type RegisterCustomerInput = z.infer<
    // Study: Supply `registerCustomerSchema` to the surrounding statement.
    typeof registerCustomerSchema
// Study: Close the generic type arguments that determine the resulting TypeScript type.
>;

// Study: Define the compile-time contract named `LoginInput` from the Zod schema so the types follow validation.
export type LoginInput = z.infer<
    // Study: Supply `loginSchema` to the surrounding statement.
    typeof loginSchema
// Study: Close the generic type arguments that determine the resulting TypeScript type.
>;

// Study: Define the compile-time contract named `RefreshTokenInput` from the Zod schema so the types follow validation.
export type RefreshTokenInput = z.infer<
    // Study: Supply `refreshTokenSchema` to the surrounding statement.
    typeof refreshTokenSchema
// Study: Close the generic type arguments that determine the resulting TypeScript type.
>;

// Study: Define the compile-time contract named `CreateUserInput`.
export interface CreateUserInput {
    // Study: Define `fullName` with type `string`.
    fullName: string;
    // Study: Define `email` with type `string`.
    email: string;
    // Study: Define `phone` with type `string`.
    phone: string;
    // Study: Define `password` with type `string`.
    password: string; // hashed password
    // Study: Define `organizationRoleId` as optional with type `string`.
    organizationRoleId?: string;
// Study: Close the interface declaration.
}

// Study: Define the compile-time contract named `AuthUser`.
export interface AuthUser {
    // Study: Define `id` with type `string`.
    id: string;
    // Study: Define `fullName` with type `string`.
    fullName: string;
    // Study: Define `email` with type `string`.
    email: string;
    // Study: Define `role` with type `string`.
    role: string;
// Study: Close the interface declaration.
}

// Study: Define the compile-time contract named `LoginResponse`.
export interface LoginResponse {
    // Study: Define `accessToken` with type `string`.
    accessToken: string;
    // Study: Define `refreshToken` with type `string`.
    refreshToken: string;
    // Study: Define `user` with type `AuthUser`.
    user: AuthUser;
// Study: Close the interface declaration.
}

// Study: Define the compile-time contract named `MeResponse`.
export interface MeResponse {
    // Study: Define `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close the interface declaration.
}

// Study: Define the compile-time contract named `CreateRefreshTokenInput`.
export interface CreateRefreshTokenInput {
    // Study: Define `hashedToken` with type `string`.
    hashedToken: string;
    // Study: Define `userId` with type `string`.
    userId: string;
    // Study: Define `expiresAt` with type `Date`.
    expiresAt: Date;
// Study: Close the interface declaration.
}
