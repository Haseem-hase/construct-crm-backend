import * as authRepository from "./auth.repository";
import bcrypt from "bcrypt";
import { RegisterCustomerInput } from "./auth.types";
import { ConflictError } from "../../errors/ConflictError";

export const registerCustomer = async (
    data: RegisterCustomerInput
) => {

    const existingUser = await authRepository.findUserByEmail(
        data.email
    );

    if (existingUser) {
        throw new ConflictError("Email already registered.");
    }
    
    const existingPhone = await authRepository.findUserByPhone(
        data.phone
    );

    if(existingPhone) {
        throw new ConflictError("Phone number already registered")
    }

    const customerRole = await authRepository.findRoleByName(
        "CUSTOMER"
    );

    if(!customerRole) {
        throw new Error("Customer role do not found.")
    }

    const hashedPassword = await bcrypt.hash(
        data.password,
        10
    );

    const user = await authRepository.createUser({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        roleId: customerRole.id,
    })

    const { password, ...userWithoutPassword } = user;

     return {
        success: true,
        message: "Customer registered successfully.",
        data: userWithoutPassword,
    };
};