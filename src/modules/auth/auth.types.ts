import { z } from "zod";
import { loginSchema, registerCustomerSchema } from "./auth.validation";

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
    user: AuthUser;
}
