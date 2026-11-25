// Study: This file is about the details the CRM keeps about contractors. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `* as contractorRepository` from `"./contractor.repository"` so this file can use it.
import * as contractorRepository from "./contractor.repository";
// Study: Bring in `{ CreateContractorInput, UpdateContractorInput }` from `"./contractor.types"` so this file can use it.
import { CreateContractorInput, UpdateContractorInput } from "./contractor.types";
// Study: Bring in `{ NotFoundError }` from `"../../errors/NotFoundError"` so this file can use it.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Bring in `{ ConflictError }` from `"../../errors/ConflictError"` so this file can use it.
import { ConflictError } from "../../errors/ConflictError";

// Study: Make `createContractor` available to other files. Its result arrives after its work finishes.
export const createContractor = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `data`. `CreateContractorInput` describes what that information should look like.
    data: CreateContractorInput
// Study: Finish this group and continue the surrounding step.
) => {
    // Check phone uniqueness
    // Study: Call `contractorRepository.findContractorByPhone` and wait for it to finish and store its result in `existingByPhone`.
    const existingByPhone = await contractorRepository.findContractorByPhone(
        // Study: Supply `organizationId` to the surrounding statement.
        organizationId,
        // Study: Use the phone that was submitted for this step.
        data.phone
    // Study: End the list of information being sent to this step.
    );
    
    // Study: Do the next step if this check passes: `existingByPhone`.
    if (existingByPhone) {
        // Study: Stop here and pass the problem onward: `new ConflictError("A contractor with this phone number already exists in this organ…`.
        throw new ConflictError("A contractor with this phone number already exists in this organization.");
    // Study: End this group of steps.
    }

    // Check email uniqueness if provided
    // Study: Do the next step if this check passes: `data.email && data.email !== ""`.
    if (data.email && data.email !== "") {
        // Study: Call `contractorRepository.findContractorByEmail` and wait for it to finish and store its result in `existingByEmail`.
        const existingByEmail = await contractorRepository.findContractorByEmail(
            // Study: Supply `organizationId` to the surrounding statement.
            organizationId,
            // Study: Use the email that was submitted for this step.
            data.email
        // Study: End the list of information being sent to this step.
        );
        
        // Study: Do the next step if this check passes: `existingByEmail`.
        if (existingByEmail) {
            // Study: Stop here and report this problem: "A contractor with this email already exists in this organization."
            throw new ConflictError("A contractor with this email already exists in this organization.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Study: Call `contractorRepository.createContractor` and wait for it to finish and store its result in `contractor`.
    const contractor = await contractorRepository.createContractor({
        // Study: Expand the values from `data` into the surrounding collection.
        ...data,
        // Study: Carry the value of `organizationId` into the new group under the same name.
        organizationId,
    // Study: End this group of values.
    });

    // Study: Give `contractor` back to the code that asked for it.
    return contractor;
// Study: End this group of steps.
};

// Study: Make `getOrganizationContractors` available to other files. Its result arrives after its work finishes.
export const getOrganizationContractors = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await contractorRepository.findContractors(organizationId)` back to the code that asked for it.
    return await contractorRepository.findContractors(organizationId);
// Study: End this group of steps.
};

// Study: Make `getPlatformContractors` available to other files. Its result arrives after its work finishes.
export const getPlatformContractors = async () => contractorRepository.findAllPlatformContractors();
// Study: Make `getPlatformContractorById` available to other files. Its result arrives after its work finishes.
export const getPlatformContractorById = async (contractorId: string) => {
    // Study: Call `contractorRepository.findPlatformContractorById` and wait for it to finish and store its result in `contractor`.
    const contractor = await contractorRepository.findPlatformContractorById(contractorId);
    // Study: Do the next step if there is no value for `contractor` . If so, stop and report "Contractor not found."
    if (!contractor) throw new NotFoundError("Contractor not found.");
    // Study: Give `contractor` back to the code that asked for it.
    return contractor;
// Study: End this group of steps.
};

// Study: Make `getContractorById` available to other files. Its result arrives after its work finishes.
export const getContractorById = async (
    // Study: This step receives `contractorId`. `string` describes what that information should look like.
    contractorId: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Call `contractorRepository.findContractorById` and wait for it to finish and store its result in `contractor`.
    const contractor = await contractorRepository.findContractorById(
        // Study: Supply `contractorId` to the surrounding statement.
        contractorId,
        // Study: Supply `organizationId` to the surrounding statement.
        organizationId
    // Study: End the list of information being sent to this step.
    );
    
    // Study: Do the next step if there is no value for `contractor`.
    if (!contractor) {
        // Study: Stop here and report this problem: "Contractor not found."
        throw new NotFoundError("Contractor not found.");
    // Study: End this group of steps.
    }

    // Study: Give `contractor` back to the code that asked for it.
    return contractor;
// Study: End this group of steps.
};

// Study: Make `updateContractor` available to other files. Its result arrives after its work finishes.
export const updateContractor = async (
    // Study: This step receives `contractorId`. `string` describes what that information should look like.
    contractorId: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `data`. `UpdateContractorInput` describes what that information should look like.
    data: UpdateContractorInput
// Study: Finish this group and continue the surrounding step.
) => {
    // Verify existence
    // Study: Call `contractorRepository.findContractorById` and wait for it to finish and store its result in `existingContractor`.
    const existingContractor = await contractorRepository.findContractorById(
        // Study: Supply `contractorId` to the surrounding statement.
        contractorId,
        // Study: Supply `organizationId` to the surrounding statement.
        organizationId
    // Study: End the list of information being sent to this step.
    );
    
    // Study: Do the next step if there is no value for `existingContractor`.
    if (!existingContractor) {
        // Study: Stop here and report this problem: "Contractor not found."
        throw new NotFoundError("Contractor not found.");
    // Study: End this group of steps.
    }

    // Check phone uniqueness if being changed
    // Study: Do the next step if this check passes: `data.phone && data.phone !== existingContractor.phone`.
    if (data.phone && data.phone !== existingContractor.phone) {
        // Study: Call `contractorRepository.findContractorByPhone` and wait for it to finish and store its result in `existingByPhone`.
        const existingByPhone = await contractorRepository.findContractorByPhone(
            // Study: Supply `organizationId` to the surrounding statement.
            organizationId,
            // Study: Use the phone that was submitted for this step.
            data.phone
        // Study: End the list of information being sent to this step.
        );
        
        // Study: Do the next step if this check passes: `existingByPhone`.
        if (existingByPhone) {
            // Study: Stop here and pass the problem onward: `new ConflictError("A contractor with this phone number already exists in this organ…`.
            throw new ConflictError("A contractor with this phone number already exists in this organization.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Check email uniqueness if being changed
    // Study: Do the next step if this check passes: `data.email && data.email !== "" && data.email !== existingContractor.email`.
    if (data.email && data.email !== "" && data.email !== existingContractor.email) {
        // Study: Call `contractorRepository.findContractorByEmail` and wait for it to finish and store its result in `existingByEmail`.
        const existingByEmail = await contractorRepository.findContractorByEmail(
            // Study: Supply `organizationId` to the surrounding statement.
            organizationId,
            // Study: Use the email that was submitted for this step.
            data.email
        // Study: End the list of information being sent to this step.
        );
        
        // Study: Do the next step if this check passes: `existingByEmail`.
        if (existingByEmail) {
            // Study: Stop here and report this problem: "A contractor with this email already exists in this organization."
            throw new ConflictError("A contractor with this email already exists in this organization.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Study: Call `contractorRepository.updateContractor` and wait for it to finish and store its result in `updatedContractor`.
    const updatedContractor = await contractorRepository.updateContractor(
        // Study: Supply `contractorId` to the surrounding statement.
        contractorId,
        // Study: Supply `organizationId` to the surrounding statement.
        organizationId,
        // Study: Supply `data` to the surrounding statement.
        data
    // Study: End the list of information being sent to this step.
    );

    // Study: Do the next step if there is no value for `updatedContractor`.
    if (!updatedContractor) {
        // Study: Stop here and report this problem: "Contractor not found."
        throw new NotFoundError("Contractor not found.");
    // Study: End this group of steps.
    }

    // Study: Give `updatedContractor` back to the code that asked for it.
    return updatedContractor;
// Study: End this group of steps.
};
