// Study: This file is about signing in, signing out, creating an account, and staying signed in. Lists the names and kinds of information this part of the code expects.
// Study: Bring in `{ z }` from `"zod"` so this file can use it.
import { z } from "zod";
// Study: Bring in `{ loginSchema, registerCustomerSchema, refreshTokenSchema, }` from `"./auth.validation"` so this file can use it.
import { loginSchema, registerCustomerSchema, refreshTokenSchema, } from "./auth.validation";
// Study: Bring in `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"` so this file can use it.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";

// Study: Derive the expected information for `RegisterCustomerInput` from the same rules that check submitted values.
export type RegisterCustomerInput = z.infer<
    // Study: Supply `registerCustomerSchema` to the surrounding statement.
    typeof registerCustomerSchema
// Study: End the list of details used to describe this kind of information.
>;

// Study: Derive the expected information for `LoginInput` from the same rules that check submitted values.
export type LoginInput = z.infer<
    // Study: Supply `loginSchema` to the surrounding statement.
    typeof loginSchema
// Study: End the list of details used to describe this kind of information.
>;

// Study: Derive the expected information for `RefreshTokenInput` from the same rules that check submitted values.
export type RefreshTokenInput = z.infer<
    // Study: Supply `refreshTokenSchema` to the surrounding statement.
    typeof refreshTokenSchema
// Study: End the list of details used to describe this kind of information.
>;

// Study: Describe which information `CreateUserInput` can contain so TypeScript can catch mistakes while checking the code.
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

// Study: Describe which information `AuthUser` can contain so TypeScript can catch mistakes while checking the code.
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

// Study: Describe which information `LoginResponse` can contain so TypeScript can catch mistakes while checking the code.
export interface LoginResponse {
    // Study: Define `accessToken` with type `string`.
    accessToken: string;
    // Study: Define `refreshToken` with type `string`.
    refreshToken: string;
    // Study: Define `user` with type `AuthUser`.
    user: AuthUser;
// Study: Close the interface declaration.
}

// Study: Describe which information `MeResponse` can contain so TypeScript can catch mistakes while checking the code.
export interface MeResponse {
    // Study: Define `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close the interface declaration.
}

// Study: Describe which information `CreateRefreshTokenInput` can contain so TypeScript can catch mistakes while checking the code.
export interface CreateRefreshTokenInput {
    // Study: Define `hashedToken` with type `string`.
    hashedToken: string;
    // Study: Define `userId` with type `string`.
    userId: string;
    // Study: Define `expiresAt` with type `Date`.
    expiresAt: Date;
// Study: Close the interface declaration.
}
