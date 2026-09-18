import * as contractorRepository from "./contractor.repository";
import { CreateContractorInput, UpdateContractorInput } from "./contractor.types";
import { NotFoundError } from "../../errors/NotFoundError";
import { ConflictError } from "../../errors/ConflictError";

export const createContractor = async (
    organizationId: string,
    data: CreateContractorInput
) => {
    // Check phone uniqueness
    const existingByPhone = await contractorRepository.findContractorByPhone(
        organizationId,
        data.phone
    );
    
    if (existingByPhone) {
        throw new ConflictError("A contractor with this phone number already exists in this organization.");
    }

    // Check email uniqueness if provided
    if (data.email && data.email !== "") {
        const existingByEmail = await contractorRepository.findContractorByEmail(
            organizationId,
            data.email
        );
        
        if (existingByEmail) {
            throw new ConflictError("A contractor with this email already exists in this organization.");
        }
    }

    const contractor = await contractorRepository.createContractor({
        ...data,
        organizationId,
    });

    return contractor;
};

export const getOrganizationContractors = async (
    organizationId: string
) => {
    return await contractorRepository.findContractors(organizationId);
};

export const getContractorById = async (
    contractorId: string,
    organizationId: string
) => {
    const contractor = await contractorRepository.findContractorById(
        contractorId,
        organizationId
    );
    
    if (!contractor) {
        throw new NotFoundError("Contractor not found.");
    }

    return contractor;
};

export const updateContractor = async (
    contractorId: string,
    organizationId: string,
    data: UpdateContractorInput
) => {
    // Verify existence
    const existingContractor = await contractorRepository.findContractorById(
        contractorId,
        organizationId
    );
    
    if (!existingContractor) {
        throw new NotFoundError("Contractor not found.");
    }

    // Check phone uniqueness if being changed
    if (data.phone && data.phone !== existingContractor.phone) {
        const existingByPhone = await contractorRepository.findContractorByPhone(
            organizationId,
            data.phone
        );
        
        if (existingByPhone) {
            throw new ConflictError("A contractor with this phone number already exists in this organization.");
        }
    }

    // Check email uniqueness if being changed
    if (data.email && data.email !== "" && data.email !== existingContractor.email) {
        const existingByEmail = await contractorRepository.findContractorByEmail(
            organizationId,
            data.email
        );
        
        if (existingByEmail) {
            throw new ConflictError("A contractor with this email already exists in this organization.");
        }
    }

    const updatedContractor = await contractorRepository.updateContractor(
        contractorId,
        organizationId,
        data
    );

    if (!updatedContractor) {
        throw new NotFoundError("Contractor not found.");
    }

    return updatedContractor;
};
