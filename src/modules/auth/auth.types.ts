import { z } from "zod";
import { loginSchema, registerCustomerSchema } from "./auth.validation";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";

export type RegisterCustomerInput = z.infer<
    typeof registerCustomerSchema
>;

export interface CreateUserInput {
    fullName: string;
    email: string;
    phone: string;
    password: string; // hashed password
    roleId: string;
}

export type LoginInput = z.infer<typeof loginSchema>;

export interface AuthUser {
    id: string;
    fullName: string;
    email: string;
    role: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: AuthUser;
}

export interface MeResponse {
    user: AuthenticatedUser
}

export interface CreateRefreshTokenInput {
    hashedToken: string;
    userId: string;
    expiresAt: Date;
}