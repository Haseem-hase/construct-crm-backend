import { z } from "zod";
import { loginSchema, registerCustomerSchema, refreshTokenSchema, } from "./auth.validation";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";

export type RegisterCustomerInput = z.infer<
    typeof registerCustomerSchema
>;

export type LoginInput = z.infer<
    typeof loginSchema
>;

export type RefreshTokenInput = z.infer<
    typeof refreshTokenSchema
>;

export interface CreateUserInput {
    fullName: string;
    email: string;
    phone: string;
    password: string; // hashed password
    organizationRoleId?: string;
}

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
