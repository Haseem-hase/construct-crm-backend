import bcrypt from "bcrypt";

import * as authRepository from "../auth/auth.repository";
import * as organizationRepository from "./organization.repository";

import { ConflictError } from "../../errors/ConflictError";
import {
    CreateOrganizationRequest,
    ListOrganizationsQuery,
    RegisterOrganizationInput,
} from "./organization.types";

const createOrganizationWithOwner = async (
    data: RegisterOrganizationInput & { description?: string }
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
            ...(data.description !== undefined ? { description: data.description } : {}),
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            password: hashedPassword,
            roleId: ownerRole.id,
        });

    return result;
};

export const registerOrganization = async (data: RegisterOrganizationInput) => {
    const result = await createOrganizationWithOwner(data);
    const { password, ...userWithoutPassword } = result.user;

    return {
        organization: result.organization,
        user: userWithoutPassword,
    };
};

export const listOrganizations = async (query: ListOrganizationsQuery) => {
    return organizationRepository.findOrganizations(query);
};

export const createOrganization = async (data: CreateOrganizationRequest) => {
    const result = await createOrganizationWithOwner(data);
    const { id, fullName, email, phone, organizationId, organizationRoleId, createdAt, updatedAt } = result.user;

    return {
        organization: result.organization,
        owner: {
            id,
            fullName,
            email,
            phone,
            organizationId,
            organizationRoleId,
            createdAt,
            updatedAt,
        },
    };
};
