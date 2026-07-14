import * as authRepository from "./auth.repository";

interface RegisterCustomerInput {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
}

export const registerCustomer = async (
    data: RegisterCustomerInput
) => {

    const existingUser = await authRepository.findUserByEmail(
        data.email
    );

    if (existingUser) {
        throw new Error("Email already registered.");
    }
    
    const existingPhone = await authRepository.findUserByPhone(
        data.phone
    );

    if(existingPhone) {
        throw new Error("Phone number already registered")
    }

    const customerRole = await authRepository.findRoleByName(
        "CUSTOMER"
    );

    if(!customerRole) {
        throw new Error("Customer role do not found.")
    }

     return {
        success: true,
        message: "Everything looks good.",
    };
};