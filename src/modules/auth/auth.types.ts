import { z } from "zod";
import { registerCustomerSchema } from "./auth.validation";

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