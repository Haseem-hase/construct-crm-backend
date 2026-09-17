import * as labourRepository from "./labour.repository";
import { CreateLabourInput, UpdateLabourInput } from "./labour.types";
import { NotFoundError } from "../../errors/NotFoundError";
import { BadRequestError } from "../../errors/BadRequestError";

export const createLabour = async (
    organizationId: string,
    data: CreateLabourInput
) => {
    // Verify the profession exists
    const profession = await labourRepository.findProfessionById(data.professionId);
    
    if (!profession) {
        throw new NotFoundError("Profession not found.");
    }
    
    if (!profession.isActive) {
        throw new BadRequestError("Cannot assign an inactive profession to a labour.");
    }

    const labour = await labourRepository.createLabour({
        ...data,
        organizationId,
    });

    return labour;
};

export const getOrganizationLabours = async (
    organizationId: string
) => {
    return await labourRepository.findLabours(organizationId);
};

export const getLabourById = async (
    labourId: string,
    organizationId: string
) => {
    const labour = await labourRepository.findLabourById(labourId, organizationId);
    
    if (!labour) {
        throw new NotFoundError("Labour not found.");
    }

    return labour;
};

export const updateLabour = async (
    labourId: string,
    organizationId: string,
    data: UpdateLabourInput
) => {
    const existingLabour = await labourRepository.findLabourById(labourId, organizationId);
    
    if (!existingLabour) {
        throw new NotFoundError("Labour not found.");
    }

    if (data.professionId) {
        const profession = await labourRepository.findProfessionById(data.professionId);
        
        if (!profession) {
            throw new NotFoundError("Profession not found.");
        }
        
        if (!profession.isActive) {
            throw new BadRequestError("Cannot assign an inactive profession to a labour.");
        }
    }

    const updatedLabour = await labourRepository.updateLabour(
        labourId,
        organizationId,
        data
    );

    return updatedLabour;
};
