import bcrypt from "bcrypt";

import * as authRepository from "../auth/auth.repository";
import * as organizationRepository from "./organization.repository";

import { ConflictError } from "../../errors/ConflictError";
import { RegisterOrganizationInput } from "./organization.types";

export const registerOrganization = async (
    data: RegisterOrganizationInput
) => {
    const existingEmail = await authRepository.findUserByEmail(
        data.email
    );

    if (existingEmail) {
        throw new ConflictError(
            "Email already registered."
        );
    }

    const existingPhone = await authRepository.findUserByPhone(
        data.phone
    );

    if (existingPhone) {
        throw new ConflictError(
            "Phone number already registered."
        );
    }

    const ownerRole = await authRepository.findRoleByName(
        "ORGANIZATION_OWNER"
    );

    if (!ownerRole) {
        throw new Error(
            "Organization owner role is not configured."
        );
    }

    const hashedPassword = await bcrypt.hash(
        data.password,
        10
    );

    const result =
        await organizationRepository.createOrganizationWithOwner({
            organizationName: data.organizationName,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            roleId: ownerRole.id,
        });

    const { password, ...userWithoutPassword } = result.user;

    return {
        organization: result.organization,
        user: userWithoutPassword,
    };
};