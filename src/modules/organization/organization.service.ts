// Study: This file is about the companies using the CRM and the people who own their accounts. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `bcrypt` from `"bcrypt"` so this file can use it.
import bcrypt from "bcrypt";

// Study: Bring in `* as authRepository` from `"../auth/auth.repository"` so this file can use it.
import * as authRepository from "../auth/auth.repository";
// Study: Bring in `* as organizationRepository` from `"./organization.repository"` so this file can use it.
import * as organizationRepository from "./organization.repository";

// Study: Bring in `{ ConflictError }` from `"../../errors/ConflictError"` so this file can use it.
import { ConflictError } from "../../errors/ConflictError";
// Study: Bring in `{ CreateOrganizationRequest, ListOrganizationsQuery, RegisterOrganizationInput, }` from `"./organization.types"` so this file can use it.
import {
    // Study: Make `CreateOrganizationRequest` from the other file available here.
    CreateOrganizationRequest,
    // Study: Make `ListOrganizationsQuery` from the other file available here.
    ListOrganizationsQuery,
    // Study: Make `RegisterOrganizationInput` from the other file available here.
    RegisterOrganizationInput,
// Study: Finish this group and continue the surrounding step.
} from "./organization.types";

// Study: Set up `createOrganizationWithOwner`. The code using it can wait until its work finishes.
const createOrganizationWithOwner = async (
    // Study: This step receives `data`. `RegisterOrganizationInput & { description?: string }` describes what that information should look like.
    data: RegisterOrganizationInput & { description?: string }
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Call `authRepository.findUserByEmail` and wait for it to finish and store its result in `existingEmail`.
    const existingEmail = await authRepository.findUserByEmail(
        // Study: Use the email that was submitted for this step.
        data.email
    // Study: End the list of information being sent to this step.
    );

    // Study: Do the next step if this check passes: `existingEmail`.
    if (existingEmail) {
        // Study: Stop here and pass the problem onward: `new ConflictError( "Email already registered." )`.
        throw new ConflictError(
            // Study: Supply the literal string `"Email already registered."` here.
            "Email already registered."
        // Study: Close the current group.
        );
    // Study: End this group of steps.
    }

    // Study: Check whether this phone number is already registered.
    const existingPhone = await authRepository.findUserByPhone(
        // Study: Use the phone that was submitted for this step.
        data.phone
    // Study: End the list of information being sent to this step.
    );

    // Study: Use the next step if an account with that phone number was found.
    if (existingPhone) {
        // Study: Stop here and pass the problem onward: `new ConflictError( "Phone number already registered." )`.
        throw new ConflictError(
            // Study: Supply the literal string `"Phone number already registered."` here.
            "Phone number already registered."
        // Study: Close the current group.
        );
    // Study: End this group of steps.
    }

    // Study: Call `authRepository.findRoleByName` and wait for it to finish and store its result in `ownerRole`.
    const ownerRole = await authRepository.findRoleByName(
        // Study: Supply the literal string `"ORGANIZATION_OWNER"` here.
        "ORGANIZATION_OWNER"
    // Study: End the list of information being sent to this step.
    );

    // Study: Do the next step if there is no value for `ownerRole`.
    if (!ownerRole) {
        // Study: Stop here and pass the problem onward: `new Error( "Organization owner role is not configured." )`.
        throw new Error(
            // Study: Supply the literal string `"Organization owner role is not configured."` here.
            "Organization owner role is not configured."
        // Study: Close the current group.
        );
    // Study: End this group of steps.
    }

    // Study: Scramble the password into a one-way fingerprint so the original password does not have to be stored.
    const hashedPassword = await bcrypt.hash(
        // Study: Use the password that was submitted for this step.
        data.password,
        // Study: Use 10 as bcrypt’s work setting. Higher settings take longer to calculate and make password guessing slower.
        10
    // Study: End the list of information being sent to this step.
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
        // Study: End this group of values.
        });

    // Study: Give `result` back to the code that asked for it.
    return result;
// Study: End this group of steps.
};

// Study: Make `registerOrganization` available to other files. Its result arrives after its work finishes.
export const registerOrganization = async (data: RegisterOrganizationInput) => {
    // Study: Call `createOrganizationWithOwner` and wait for it to finish and store its result in `result`.
    const result = await createOrganizationWithOwner(data);
    // Study: Set `{ password, ...userWithoutPassword }` to `result.user`.
    const { password, ...userWithoutPassword } = result.user;

    // Study: Give `{ organization: result.organization, user: userWithoutPassword, }` back to the code that asked for it.
    return {
        // Study: Set `organization` to `result.organization`.
        organization: result.organization,
        // Study: Set `user` to `userWithoutPassword`.
        user: userWithoutPassword,
    // Study: End this group of values.
    };
// Study: End this group of steps.
};

// Study: Make `listOrganizations` available to other files. Its result arrives after its work finishes.
export const listOrganizations = async (query: ListOrganizationsQuery) => {
    // Study: Give `organizationRepository.findOrganizations(query)` back to the code that asked for it.
    return organizationRepository.findOrganizations(query);
// Study: End this group of steps.
};

// Study: Make `createOrganization` available to other files. Its result arrives after its work finishes.
export const createOrganization = async (data: CreateOrganizationRequest) => {
    // Study: Call `createOrganizationWithOwner` and wait for it to finish and store its result in `result`.
    const result = await createOrganizationWithOwner(data);
    // Study: Set `{ id, fullName, email, phone, organizationId, organizationRoleId, createdAt, update…` to `result.user`.
    const { id, fullName, email, phone, organizationId, organizationRoleId, createdAt, updatedAt } = result.user;

    // Study: Give `{ organization: result.organization, owner: { id, fullName, email, phone, organizat…` back to the code that asked for it.
    return {
        // Study: Set `organization` to `result.organization`.
        organization: result.organization,
        // Study: Start the nested value for `owner`.
        owner: {
            // Study: Carry the value of `id` into the new group under the same name.
            id,
            // Study: Carry the value of `fullName` into the new group under the same name.
            fullName,
            // Study: Carry the value of `email` into the new group under the same name.
            email,
            // Study: Carry the value of `phone` into the new group under the same name.
            phone,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
            // Study: Carry the value of `organizationRoleId` into the new group under the same name.
            organizationRoleId,
            // Study: Carry the value of `createdAt` into the new group under the same name.
            createdAt,
            // Study: Carry the value of `updatedAt` into the new group under the same name.
            updatedAt,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    };
// Study: End this group of steps.
};
