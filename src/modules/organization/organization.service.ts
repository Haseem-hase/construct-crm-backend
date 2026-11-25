// Study: Apply business rules and coordinate database operations for organizations and their owners.
// Study: Import `bcrypt` from `"bcrypt"`.
import bcrypt from "bcrypt";

// Study: Import `* as authRepository` from `"../auth/auth.repository"`.
import * as authRepository from "../auth/auth.repository";
// Study: Import `* as organizationRepository` from `"./organization.repository"`.
import * as organizationRepository from "./organization.repository";

// Study: Import `{ ConflictError }` from `"../../errors/ConflictError"`.
import { ConflictError } from "../../errors/ConflictError";
// Study: Import `{ CreateOrganizationRequest, ListOrganizationsQuery, RegisterOrganizationInput, }` from `"./organization.types"`.
import {
    // Study: Bring `CreateOrganizationRequest` into scope from the imported module.
    CreateOrganizationRequest,
    // Study: Bring `ListOrganizationsQuery` into scope from the imported module.
    ListOrganizationsQuery,
    // Study: Bring `RegisterOrganizationInput` into scope from the imported module.
    RegisterOrganizationInput,
// Study: Close this group and continue the enclosing expression.
} from "./organization.types";

// Study: Define `createOrganizationWithOwner` as an async function that returns a promise.
const createOrganizationWithOwner = async (
    // Study: Accept `data` with type `RegisterOrganizationInput & { description?: string }`.
    data: RegisterOrganizationInput & { description?: string }
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Call `authRepository.findUserByEmail` and wait for it to finish and store its result in `existingEmail`.
    const existingEmail = await authRepository.findUserByEmail(
        // Study: Supply `data` to the surrounding statement.
        data.email
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `existingEmail` is truthy.
    if (existingEmail) {
        // Study: Stop this execution path by throwing `new ConflictError( "Email already registered." )`.
        throw new ConflictError(
            // Study: Supply the literal string `"Email already registered."` here.
            "Email already registered."
        // Study: Close the current group.
        );
    // Study: Close the code block.
    }

    // Study: Call `authRepository.findUserByPhone` and wait for it to finish and store its result in `existingPhone`.
    const existingPhone = await authRepository.findUserByPhone(
        // Study: Supply `data` to the surrounding statement.
        data.phone
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `existingPhone` is truthy.
    if (existingPhone) {
        // Study: Stop this execution path by throwing `new ConflictError( "Phone number already registered." )`.
        throw new ConflictError(
            // Study: Supply the literal string `"Phone number already registered."` here.
            "Phone number already registered."
        // Study: Close the current group.
        );
    // Study: Close the code block.
    }

    // Study: Call `authRepository.findRoleByName` and wait for it to finish and store its result in `ownerRole`.
    const ownerRole = await authRepository.findRoleByName(
        // Study: Supply the literal string `"ORGANIZATION_OWNER"` here.
        "ORGANIZATION_OWNER"
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `!ownerRole` is truthy.
    if (!ownerRole) {
        // Study: Stop this execution path by throwing `new Error( "Organization owner role is not configured." )`.
        throw new Error(
            // Study: Supply the literal string `"Organization owner role is not configured."` here.
            "Organization owner role is not configured."
        // Study: Close the current group.
        );
    // Study: Close the code block.
    }

    // Study: Call `bcrypt.hash` and wait for it to finish and store its result in `hashedPassword`.
    const hashedPassword = await bcrypt.hash(
        // Study: Supply `data` to the surrounding statement.
        data.password,
        // Study: Set the bcrypt cost factor to 10 for this password hash.
        10
    // Study: Close the call arguments.
    );

    // Study: Call `organizationRepository.createOrganizationWithOwner` and wait for it to finish and store its result in `result`.
    const result =
        // Study: Call `organizationRepository.createOrganizationWithOwner` and wait for it to finish.
        await organizationRepository.createOrganizationWithOwner({
            // Study: Set `organizationName` to `data.organizationName`.
            organizationName: data.organizationName,
            // Study: Expand the values from `(data.description !== undefined ? { description: data.description } : {})` into the surrounding collection.
            ...(data.description !== undefined ? { description: data.description } : {}),
            // Study: Set `fullName` to `data.fullName`.
            fullName: data.fullName,
            // Study: Set `email` to `data.email`.
            email: data.email,
            // Study: Set `phone` to `data.phone`.
            phone: data.phone,
            // Study: Set `password` to `hashedPassword`.
            password: hashedPassword,
            // Study: Set `roleId` to `ownerRole.id`.
            roleId: ownerRole.id,
        // Study: Close the object literal.
        });

    // Study: Return `result` to the caller.
    return result;
// Study: Close the code block.
};

// Study: Export `registerOrganization` as an async function that returns a promise.
export const registerOrganization = async (data: RegisterOrganizationInput) => {
    // Study: Call `createOrganizationWithOwner` and wait for it to finish and store its result in `result`.
    const result = await createOrganizationWithOwner(data);
    // Study: Set `{ password, ...userWithoutPassword }` to `result.user`.
    const { password, ...userWithoutPassword } = result.user;

    // Study: Return `{ organization: result.organization, user: userWithoutPassword, }` to the caller.
    return {
        // Study: Set `organization` to `result.organization`.
        organization: result.organization,
        // Study: Set `user` to `userWithoutPassword`.
        user: userWithoutPassword,
    // Study: Close the object literal.
    };
// Study: Close the code block.
};

// Study: Export `listOrganizations` as an async function that returns a promise.
export const listOrganizations = async (query: ListOrganizationsQuery) => {
    // Study: Return `organizationRepository.findOrganizations(query)` to the caller.
    return organizationRepository.findOrganizations(query);
// Study: Close the code block.
};

// Study: Export `createOrganization` as an async function that returns a promise.
export const createOrganization = async (data: CreateOrganizationRequest) => {
    // Study: Call `createOrganizationWithOwner` and wait for it to finish and store its result in `result`.
    const result = await createOrganizationWithOwner(data);
    // Study: Set `{ id, fullName, email, phone, organizationId, organizationRoleId, createdAt, update…` to `result.user`.
    const { id, fullName, email, phone, organizationId, organizationRoleId, createdAt, updatedAt } = result.user;

    // Study: Return `{ organization: result.organization, owner: { id, fullName, email, phone, organizat…` to the caller.
    return {
        // Study: Set `organization` to `result.organization`.
        organization: result.organization,
        // Study: Start the nested value for `owner`.
        owner: {
            // Study: Pass the current `id` value under the same property name.
            id,
            // Study: Pass the current `fullName` value under the same property name.
            fullName,
            // Study: Pass the current `email` value under the same property name.
            email,
            // Study: Pass the current `phone` value under the same property name.
            phone,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
            // Study: Pass the current `organizationRoleId` value under the same property name.
            organizationRoleId,
            // Study: Pass the current `createdAt` value under the same property name.
            createdAt,
            // Study: Pass the current `updatedAt` value under the same property name.
            updatedAt,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    };
// Study: Close the code block.
};
