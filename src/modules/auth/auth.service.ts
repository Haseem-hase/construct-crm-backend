import * as authRepository from "./auth.repository";
import bcrypt from "bcrypt";
import { LoginInput, LoginResponse, MeResponse, RegisterCustomerInput } from "./auth.types";
import { ConflictError } from "../../errors/ConflictError";
import { generateAccessToken, generateRefreshToken } from "../../utils/jwt.utils";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
import { addDuration } from "../../utils/date.utils";
import { getDurationEnv } from "../../utils/env.utils";
import { createRefreshToken } from "./refresh-token.repository";

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

//login
export const login = async (
    data: LoginInput
): Promise<LoginResponse> => {

    const user = await authRepository.findUserByEmail(data.email);

    if (!user) {
        throw new UnauthorizedError("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(
        data.password,
        user.password
    );

    if (!isPasswordValid) {
        throw new UnauthorizedError("Invalid email or password.");
    }

    const payload = {
        userId: user.id,
        role: user.role.name,
    };

    const accessToken = generateAccessToken(payload);

    const refreshToken = generateRefreshToken(payload);

    const hashedRefreshToken = await bcrypt.hash(
        refreshToken, 10
    )

    const expiresAt = addDuration(
        getDurationEnv("JWT_REFRESH_EXPIRES_IN")
    )

    await createRefreshToken({
        hashedToken: hashedRefreshToken,
        userId:user.id,
        expiresAt,
    })

    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role.name,
        },
    };
};

//get me 
export const getMe = async (
    user: AuthenticatedUser
): Promise<MeResponse> => {
    
    return {
        user,
    }
};