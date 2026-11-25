// Study: Apply business rules and coordinate database operations for contractor records.
// Study: Import `* as contractorRepository` from `"./contractor.repository"`.
import * as contractorRepository from "./contractor.repository";
// Study: Import `{ CreateContractorInput, UpdateContractorInput }` from `"./contractor.types"`.
import { CreateContractorInput, UpdateContractorInput } from "./contractor.types";
// Study: Import `{ NotFoundError }` from `"../../errors/NotFoundError"`.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Import `{ ConflictError }` from `"../../errors/ConflictError"`.
import { ConflictError } from "../../errors/ConflictError";

// Study: Export `createContractor` as an async function that returns a promise.
export const createContractor = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `data` with type `CreateContractorInput`.
    data: CreateContractorInput
// Study: Close this group and continue the enclosing expression.
) => {
    // Check phone uniqueness
    // Study: Call `contractorRepository.findContractorByPhone` and wait for it to finish and store its result in `existingByPhone`.
    const existingByPhone = await contractorRepository.findContractorByPhone(
        // Study: Supply `organizationId` to the surrounding statement.
        organizationId,
        // Study: Supply `data` to the surrounding statement.
        data.phone
    // Study: Close the call arguments.
    );
    
    // Study: Run the following branch when `existingByPhone` is truthy.
    if (existingByPhone) {
        // Study: Stop this execution path by throwing `new ConflictError("A contractor with this phone number already exists in this organ…`.
        throw new ConflictError("A contractor with this phone number already exists in this organization.");
    // Study: Close the code block.
    }

    // Check email uniqueness if provided
    // Study: Run the following branch when `data.email && data.email !== ""` is truthy.
    if (data.email && data.email !== "") {
        // Study: Call `contractorRepository.findContractorByEmail` and wait for it to finish and store its result in `existingByEmail`.
        const existingByEmail = await contractorRepository.findContractorByEmail(
            // Study: Supply `organizationId` to the surrounding statement.
            organizationId,
            // Study: Supply `data` to the surrounding statement.
            data.email
        // Study: Close the call arguments.
        );
        
        // Study: Run the following branch when `existingByEmail` is truthy.
        if (existingByEmail) {
            // Study: Stop this execution path by throwing `new ConflictError("A contractor with this email already exists in this organization.")`.
            throw new ConflictError("A contractor with this email already exists in this organization.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Study: Call `contractorRepository.createContractor` and wait for it to finish and store its result in `contractor`.
    const contractor = await contractorRepository.createContractor({
        // Study: Expand the values from `data` into the surrounding collection.
        ...data,
        // Study: Pass the current `organizationId` value under the same property name.
        organizationId,
    // Study: Close the object literal.
    });

    // Study: Return `contractor` to the caller.
    return contractor;
// Study: Close the code block.
};

// Study: Export `getOrganizationContractors` as an async function that returns a promise.
export const getOrganizationContractors = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await contractorRepository.findContractors(organizationId)` to the caller.
    return await contractorRepository.findContractors(organizationId);
// Study: Close the code block.
};

// Study: Export `getPlatformContractors` as an async function that returns a promise.
export const getPlatformContractors = async () => contractorRepository.findAllPlatformContractors();
// Study: Export `getPlatformContractorById` as an async function that returns a promise.
export const getPlatformContractorById = async (contractorId: string) => {
    // Study: Call `contractorRepository.findPlatformContractorById` and wait for it to finish and store its result in `contractor`.
    const contractor = await contractorRepository.findPlatformContractorById(contractorId);
    // Study: Run the following branch when `!contractor` is truthy and throw `new NotFoundError("Contractor not found.")`.
    if (!contractor) throw new NotFoundError("Contractor not found.");
    // Study: Return `contractor` to the caller.
    return contractor;
// Study: Close the code block.
};

// Study: Export `getContractorById` as an async function that returns a promise.
export const getContractorById = async (
    // Study: Accept `contractorId` with type `string`.
    contractorId: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Call `contractorRepository.findContractorById` and wait for it to finish and store its result in `contractor`.
    const contractor = await contractorRepository.findContractorById(
        // Study: Supply `contractorId` to the surrounding statement.
        contractorId,
        // Study: Supply `organizationId` to the surrounding statement.
        organizationId
    // Study: Close the call arguments.
    );
    
    // Study: Run the following branch when `!contractor` is truthy.
    if (!contractor) {
        // Study: Stop this execution path by throwing `new NotFoundError("Contractor not found.")`.
        throw new NotFoundError("Contractor not found.");
    // Study: Close the code block.
    }

    // Study: Return `contractor` to the caller.
    return contractor;
// Study: Close the code block.
};

// Study: Export `updateContractor` as an async function that returns a promise.
export const updateContractor = async (
    // Study: Accept `contractorId` with type `string`.
    contractorId: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `data` with type `UpdateContractorInput`.
    data: UpdateContractorInput
// Study: Close this group and continue the enclosing expression.
) => {
    // Verify existence
    // Study: Call `contractorRepository.findContractorById` and wait for it to finish and store its result in `existingContractor`.
    const existingContractor = await contractorRepository.findContractorById(
        // Study: Supply `contractorId` to the surrounding statement.
        contractorId,
        // Study: Supply `organizationId` to the surrounding statement.
        organizationId
    // Study: Close the call arguments.
    );
    
    // Study: Run the following branch when `!existingContractor` is truthy.
    if (!existingContractor) {
        // Study: Stop this execution path by throwing `new NotFoundError("Contractor not found.")`.
        throw new NotFoundError("Contractor not found.");
    // Study: Close the code block.
    }

    // Check phone uniqueness if being changed
    // Study: Run the following branch when `data.phone && data.phone !== existingContractor.phone` is truthy.
    if (data.phone && data.phone !== existingContractor.phone) {
        // Study: Call `contractorRepository.findContractorByPhone` and wait for it to finish and store its result in `existingByPhone`.
        const existingByPhone = await contractorRepository.findContractorByPhone(
            // Study: Supply `organizationId` to the surrounding statement.
            organizationId,
            // Study: Supply `data` to the surrounding statement.
            data.phone
        // Study: Close the call arguments.
        );
        
        // Study: Run the following branch when `existingByPhone` is truthy.
        if (existingByPhone) {
            // Study: Stop this execution path by throwing `new ConflictError("A contractor with this phone number already exists in this organ…`.
            throw new ConflictError("A contractor with this phone number already exists in this organization.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Check email uniqueness if being changed
    // Study: Run the following branch when `data.email && data.email !== "" && data.email !== existingContractor.email` is truthy.
    if (data.email && data.email !== "" && data.email !== existingContractor.email) {
        // Study: Call `contractorRepository.findContractorByEmail` and wait for it to finish and store its result in `existingByEmail`.
        const existingByEmail = await contractorRepository.findContractorByEmail(
            // Study: Supply `organizationId` to the surrounding statement.
            organizationId,
            // Study: Supply `data` to the surrounding statement.
            data.email
        // Study: Close the call arguments.
        );
        
        // Study: Run the following branch when `existingByEmail` is truthy.
        if (existingByEmail) {
            // Study: Stop this execution path by throwing `new ConflictError("A contractor with this email already exists in this organization.")`.
            throw new ConflictError("A contractor with this email already exists in this organization.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Study: Call `contractorRepository.updateContractor` and wait for it to finish and store its result in `updatedContractor`.
    const updatedContractor = await contractorRepository.updateContractor(
        // Study: Supply `contractorId` to the surrounding statement.
        contractorId,
        // Study: Supply `organizationId` to the surrounding statement.
        organizationId,
        // Study: Supply `data` to the surrounding statement.
        data
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `!updatedContractor` is truthy.
    if (!updatedContractor) {
        // Study: Stop this execution path by throwing `new NotFoundError("Contractor not found.")`.
        throw new NotFoundError("Contractor not found.");
    // Study: Close the code block.
    }

    // Study: Return `updatedContractor` to the caller.
    return updatedContractor;
// Study: Close the code block.
};
