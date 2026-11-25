// Study: This file is about workers and the kinds of work they do. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `* as labourRepository` from `"./labour.repository"` so this file can use it.
import * as labourRepository from "./labour.repository";
// Study: Bring in `{ CreateLabourInput, UpdateLabourInput }` from `"./labour.types"` so this file can use it.
import { CreateLabourInput, UpdateLabourInput } from "./labour.types";
// Study: Bring in `{ NotFoundError }` from `"../../errors/NotFoundError"` so this file can use it.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Bring in `{ BadRequestError }` from `"../../errors/BadRequestError"` so this file can use it.
import { BadRequestError } from "../../errors/BadRequestError";
// Study: Bring in `{ ConflictError }` from `"../../errors/ConflictError"` so this file can use it.
import { ConflictError } from "../../errors/ConflictError";
// Study: Bring in `{ Prisma }` from `"@prisma/client"` so this file can use it.
import { Prisma } from "@prisma/client";

// Study: Make `createLabour` available to other files. Its result arrives after its work finishes.
export const createLabour = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `data`. `CreateLabourInput` describes what that information should look like.
    data: CreateLabourInput
// Study: Finish this group and continue the surrounding step.
) => {
    // Verify the profession exists
    // Study: Call `labourRepository.findProfessionById` and wait for it to finish and store its result in `profession`.
    const profession = await labourRepository.findProfessionById(data.professionId);
    
    // Study: Do the next step if there is no value for `profession`.
    if (!profession) {
        // Study: Stop here and report this problem: "Profession not found."
        throw new NotFoundError("Profession not found.");
    // Study: End this group of steps.
    }
    
    // Study: Do the next step if this check passes: `!profession.isActive`.
    if (!profession.isActive) {
        // Study: Stop here and report this problem: "Cannot assign an inactive profession to a labour."
        throw new BadRequestError("Cannot assign an inactive profession to a labour.");
    // Study: End this group of steps.
    }

    // Study: Call `labourRepository.findLabourByPhone` and wait for it to finish and store its result in `existingLabour`.
    const existingLabour = await labourRepository.findLabourByPhone(organizationId, data.phone);
    // Study: Do the next step if this check passes: `existingLabour`.
    if (existingLabour) {
        // Study: Stop here and pass the problem onward: `new ConflictError("A labour with this phone number already exists in this organizat…`.
        throw new ConflictError("A labour with this phone number already exists in this organization.");
    // Study: End this group of steps.
    }

    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Call `labourRepository.createLabour` and wait for it to finish and store its result in `labour`.
        const labour = await labourRepository.createLabour({
            // Study: Expand the values from `data` into the surrounding collection.
            ...data,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        });

        // Study: Give `labour` back to the code that asked for it.
        return labour;
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Do the next step if this check passes: `error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"`.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            // Study: Set `target` to `error.meta?.target as string[] | undefined`.
            const target = error.meta?.target as string[] | undefined;
            // Study: Do the next step if this check passes: `target && target.includes("organizationId") && target.includes("phone")`.
            if (target && target.includes("organizationId") && target.includes("phone")) {
                // Study: Stop here and pass the problem onward: `new ConflictError("A labour with this phone number already exists in this organizat…`.
                throw new ConflictError("A labour with this phone number already exists in this organization.");
            // Study: End this group of steps.
            }
        // Study: End this group of steps.
        }
        // Study: Stop here and pass the problem onward: `error`.
        throw error;
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};

// Study: Make `getOrganizationLabours` available to other files. Its result arrives after its work finishes.
export const getOrganizationLabours = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await labourRepository.findLabours(organizationId)` back to the code that asked for it.
    return await labourRepository.findLabours(organizationId);
// Study: End this group of steps.
};

// Study: Make `getPlatformLabours` available to other files. Its result arrives after its work finishes.
export const getPlatformLabours = async () => labourRepository.findAllPlatformLabours();
// Study: Make `getPlatformLabourById` available to other files. Its result arrives after its work finishes.
export const getPlatformLabourById = async (labourId: string) => {
    // Study: Call `labourRepository.findPlatformLabourById` and wait for it to finish and store its result in `labour`.
    const labour = await labourRepository.findPlatformLabourById(labourId);
    // Study: Do the next step if there is no value for `labour` . If so, stop and report "Labour not found."
    if (!labour) throw new NotFoundError("Labour not found.");
    // Study: Give `labour` back to the code that asked for it.
    return labour;
// Study: End this group of steps.
};

// Study: Make `getLabourById` available to other files. Its result arrives after its work finishes.
export const getLabourById = async (
    // Study: This step receives `labourId`. `string` describes what that information should look like.
    labourId: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Call `labourRepository.findLabourById` and wait for it to finish and store its result in `labour`.
    const labour = await labourRepository.findLabourById(labourId, organizationId);
    
    // Study: Do the next step if there is no value for `labour`.
    if (!labour) {
        // Study: Stop here and report this problem: "Labour not found."
        throw new NotFoundError("Labour not found.");
    // Study: End this group of steps.
    }

    // Study: Give `labour` back to the code that asked for it.
    return labour;
// Study: End this group of steps.
};

// Study: Make `updateLabour` available to other files. Its result arrives after its work finishes.
export const updateLabour = async (
    // Study: This step receives `labourId`. `string` describes what that information should look like.
    labourId: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `data`. `UpdateLabourInput` describes what that information should look like.
    data: UpdateLabourInput
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Call `labourRepository.findLabourById` and wait for it to finish and store its result in `existingLabour`.
    const existingLabour = await labourRepository.findLabourById(labourId, organizationId);
    
    // Study: Do the next step if there is no value for `existingLabour`.
    if (!existingLabour) {
        // Study: Stop here and report this problem: "Labour not found."
        throw new NotFoundError("Labour not found.");
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `data.professionId`.
    if (data.professionId) {
        // Study: Call `labourRepository.findProfessionById` and wait for it to finish and store its result in `profession`.
        const profession = await labourRepository.findProfessionById(data.professionId);
        
        // Study: Do the next step if there is no value for `profession`.
        if (!profession) {
            // Study: Stop here and report this problem: "Profession not found."
            throw new NotFoundError("Profession not found.");
        // Study: End this group of steps.
        }
        
        // Study: Do the next step if this check passes: `!profession.isActive`.
        if (!profession.isActive) {
            // Study: Stop here and report this problem: "Cannot assign an inactive profession to a labour."
            throw new BadRequestError("Cannot assign an inactive profession to a labour.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `data.phone && data.phone !== existingLabour.phone`.
    if (data.phone && data.phone !== existingLabour.phone) {
        // Study: Call `labourRepository.findLabourByPhone` and wait for it to finish and store its result in `phoneOwner`.
        const phoneOwner = await labourRepository.findLabourByPhone(organizationId, data.phone);
        // Study: Do the next step if this check passes: `phoneOwner`.
        if (phoneOwner) {
            // Study: Stop here and pass the problem onward: `new ConflictError("A labour with this phone number already exists in this organizat…`.
            throw new ConflictError("A labour with this phone number already exists in this organization.");
        // Study: End this group of steps.
        }
    // Study: End this group of steps.
    }

    // Study: Try these steps. If one fails, go to the error-handling steps below.
    try {
        // Study: Call `labourRepository.updateLabour` and wait for it to finish and store its result in `updatedLabour`.
        const updatedLabour = await labourRepository.updateLabour(
            // Study: Supply `labourId` to the surrounding statement.
            labourId,
            // Study: Supply `organizationId` to the surrounding statement.
            organizationId,
            // Study: Supply `data` to the surrounding statement.
            data
        // Study: End the list of information being sent to this step.
        );

        // Study: Give `updatedLabour` back to the code that asked for it.
        return updatedLabour;
    // Study: Handle a problem raised during the steps above.
    } catch (error) {
        // Study: Do the next step if this check passes: `error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"`.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            // Study: Set `target` to `error.meta?.target as string[] | undefined`.
            const target = error.meta?.target as string[] | undefined;
            // Study: Do the next step if this check passes: `target && target.includes("organizationId") && target.includes("phone")`.
            if (target && target.includes("organizationId") && target.includes("phone")) {
                // Study: Stop here and pass the problem onward: `new ConflictError("A labour with this phone number already exists in this organizat…`.
                throw new ConflictError("A labour with this phone number already exists in this organization.");
            // Study: End this group of steps.
            }
        // Study: End this group of steps.
        }
        // Study: Stop here and pass the problem onward: `error`.
        throw error;
    // Study: End this group of steps.
    }
// Study: End this group of steps.
};
