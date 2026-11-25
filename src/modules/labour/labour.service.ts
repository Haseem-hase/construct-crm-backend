// Study: Apply business rules and coordinate database operations for worker records and their professions.
// Study: Import `* as labourRepository` from `"./labour.repository"`.
import * as labourRepository from "./labour.repository";
// Study: Import `{ CreateLabourInput, UpdateLabourInput }` from `"./labour.types"`.
import { CreateLabourInput, UpdateLabourInput } from "./labour.types";
// Study: Import `{ NotFoundError }` from `"../../errors/NotFoundError"`.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Import `{ BadRequestError }` from `"../../errors/BadRequestError"`.
import { BadRequestError } from "../../errors/BadRequestError";
// Study: Import `{ ConflictError }` from `"../../errors/ConflictError"`.
import { ConflictError } from "../../errors/ConflictError";
// Study: Import `{ Prisma }` from `"@prisma/client"`.
import { Prisma } from "@prisma/client";

// Study: Export `createLabour` as an async function that returns a promise.
export const createLabour = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `data` with type `CreateLabourInput`.
    data: CreateLabourInput
// Study: Close this group and continue the enclosing expression.
) => {
    // Verify the profession exists
    // Study: Call `labourRepository.findProfessionById` and wait for it to finish and store its result in `profession`.
    const profession = await labourRepository.findProfessionById(data.professionId);
    
    // Study: Run the following branch when `!profession` is truthy.
    if (!profession) {
        // Study: Stop this execution path by throwing `new NotFoundError("Profession not found.")`.
        throw new NotFoundError("Profession not found.");
    // Study: Close the code block.
    }
    
    // Study: Run the following branch when `!profession.isActive` is truthy.
    if (!profession.isActive) {
        // Study: Stop this execution path by throwing `new BadRequestError("Cannot assign an inactive profession to a labour.")`.
        throw new BadRequestError("Cannot assign an inactive profession to a labour.");
    // Study: Close the code block.
    }

    // Study: Call `labourRepository.findLabourByPhone` and wait for it to finish and store its result in `existingLabour`.
    const existingLabour = await labourRepository.findLabourByPhone(organizationId, data.phone);
    // Study: Run the following branch when `existingLabour` is truthy.
    if (existingLabour) {
        // Study: Stop this execution path by throwing `new ConflictError("A labour with this phone number already exists in this organizat…`.
        throw new ConflictError("A labour with this phone number already exists in this organization.");
    // Study: Close the code block.
    }

    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Call `labourRepository.createLabour` and wait for it to finish and store its result in `labour`.
        const labour = await labourRepository.createLabour({
            // Study: Expand the values from `data` into the surrounding collection.
            ...data,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        });

        // Study: Return `labour` to the caller.
        return labour;
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Run the following branch when `error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"` is truthy.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            // Study: Set `target` to `error.meta?.target as string[] | undefined`.
            const target = error.meta?.target as string[] | undefined;
            // Study: Run the following branch when `target && target.includes("organizationId") && target.includes("phone")` is truthy.
            if (target && target.includes("organizationId") && target.includes("phone")) {
                // Study: Stop this execution path by throwing `new ConflictError("A labour with this phone number already exists in this organizat…`.
                throw new ConflictError("A labour with this phone number already exists in this organization.");
            // Study: Close the code block.
            }
        // Study: Close the code block.
        }
        // Study: Stop this execution path by throwing `error`.
        throw error;
    // Study: Close the code block.
    }
// Study: Close the code block.
};

// Study: Export `getOrganizationLabours` as an async function that returns a promise.
export const getOrganizationLabours = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await labourRepository.findLabours(organizationId)` to the caller.
    return await labourRepository.findLabours(organizationId);
// Study: Close the code block.
};

// Study: Export `getPlatformLabours` as an async function that returns a promise.
export const getPlatformLabours = async () => labourRepository.findAllPlatformLabours();
// Study: Export `getPlatformLabourById` as an async function that returns a promise.
export const getPlatformLabourById = async (labourId: string) => {
    // Study: Call `labourRepository.findPlatformLabourById` and wait for it to finish and store its result in `labour`.
    const labour = await labourRepository.findPlatformLabourById(labourId);
    // Study: Run the following branch when `!labour` is truthy and throw `new NotFoundError("Labour not found.")`.
    if (!labour) throw new NotFoundError("Labour not found.");
    // Study: Return `labour` to the caller.
    return labour;
// Study: Close the code block.
};

// Study: Export `getLabourById` as an async function that returns a promise.
export const getLabourById = async (
    // Study: Accept `labourId` with type `string`.
    labourId: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Call `labourRepository.findLabourById` and wait for it to finish and store its result in `labour`.
    const labour = await labourRepository.findLabourById(labourId, organizationId);
    
    // Study: Run the following branch when `!labour` is truthy.
    if (!labour) {
        // Study: Stop this execution path by throwing `new NotFoundError("Labour not found.")`.
        throw new NotFoundError("Labour not found.");
    // Study: Close the code block.
    }

    // Study: Return `labour` to the caller.
    return labour;
// Study: Close the code block.
};

// Study: Export `updateLabour` as an async function that returns a promise.
export const updateLabour = async (
    // Study: Accept `labourId` with type `string`.
    labourId: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `data` with type `UpdateLabourInput`.
    data: UpdateLabourInput
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Call `labourRepository.findLabourById` and wait for it to finish and store its result in `existingLabour`.
    const existingLabour = await labourRepository.findLabourById(labourId, organizationId);
    
    // Study: Run the following branch when `!existingLabour` is truthy.
    if (!existingLabour) {
        // Study: Stop this execution path by throwing `new NotFoundError("Labour not found.")`.
        throw new NotFoundError("Labour not found.");
    // Study: Close the code block.
    }

    // Study: Run the following branch when `data.professionId` is truthy.
    if (data.professionId) {
        // Study: Call `labourRepository.findProfessionById` and wait for it to finish and store its result in `profession`.
        const profession = await labourRepository.findProfessionById(data.professionId);
        
        // Study: Run the following branch when `!profession` is truthy.
        if (!profession) {
            // Study: Stop this execution path by throwing `new NotFoundError("Profession not found.")`.
            throw new NotFoundError("Profession not found.");
        // Study: Close the code block.
        }
        
        // Study: Run the following branch when `!profession.isActive` is truthy.
        if (!profession.isActive) {
            // Study: Stop this execution path by throwing `new BadRequestError("Cannot assign an inactive profession to a labour.")`.
            throw new BadRequestError("Cannot assign an inactive profession to a labour.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Study: Run the following branch when `data.phone && data.phone !== existingLabour.phone` is truthy.
    if (data.phone && data.phone !== existingLabour.phone) {
        // Study: Call `labourRepository.findLabourByPhone` and wait for it to finish and store its result in `phoneOwner`.
        const phoneOwner = await labourRepository.findLabourByPhone(organizationId, data.phone);
        // Study: Run the following branch when `phoneOwner` is truthy.
        if (phoneOwner) {
            // Study: Stop this execution path by throwing `new ConflictError("A labour with this phone number already exists in this organizat…`.
            throw new ConflictError("A labour with this phone number already exists in this organization.");
        // Study: Close the code block.
        }
    // Study: Close the code block.
    }

    // Study: Run this block and handle failures in the associated catch block.
    try {
        // Study: Call `labourRepository.updateLabour` and wait for it to finish and store its result in `updatedLabour`.
        const updatedLabour = await labourRepository.updateLabour(
            // Study: Supply `labourId` to the surrounding statement.
            labourId,
            // Study: Supply `organizationId` to the surrounding statement.
            organizationId,
            // Study: Supply `data` to the surrounding statement.
            data
        // Study: Close the call arguments.
        );

        // Study: Return `updatedLabour` to the caller.
        return updatedLabour;
    // Study: Handle an exception from the try block as `error`.
    } catch (error) {
        // Study: Run the following branch when `error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002"` is truthy.
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
            // Study: Set `target` to `error.meta?.target as string[] | undefined`.
            const target = error.meta?.target as string[] | undefined;
            // Study: Run the following branch when `target && target.includes("organizationId") && target.includes("phone")` is truthy.
            if (target && target.includes("organizationId") && target.includes("phone")) {
                // Study: Stop this execution path by throwing `new ConflictError("A labour with this phone number already exists in this organizat…`.
                throw new ConflictError("A labour with this phone number already exists in this organization.");
            // Study: Close the code block.
            }
        // Study: Close the code block.
        }
        // Study: Stop this execution path by throwing `error`.
        throw error;
    // Study: Close the code block.
    }
// Study: Close the code block.
};
