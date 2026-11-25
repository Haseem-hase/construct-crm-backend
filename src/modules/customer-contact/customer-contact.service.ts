// Study: Apply business rules and coordinate database operations for contacts attached to customer accounts.
// Study: Import `* as customerContactRepository` from `"./customer-contact.repository"`.
import * as customerContactRepository from "./customer-contact.repository";
// Study: Import `* as customerRepository` from `"../customers/customer.repository"`.
import * as customerRepository from "../customers/customer.repository";
// Study: Import `{ CreateCustomerContactInput, UpdateCustomerContactInput }` from `"./customer-contact.types"`.
import { CreateCustomerContactInput, UpdateCustomerContactInput } from "./customer-contact.types";
// Study: Import `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"`.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Import `{ ForbiddenError }` from `"../../errors/ForbiddenError"`.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Import `{ NotFoundError }` from `"../../errors/NotFoundError"`.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";

// Study: Export `createCustomerContact` as an async function that returns a promise.
export const createCustomerContact = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `data` with type `CreateCustomerContactInput`.
    data: CreateCustomerContactInput,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run the following branch when `!user.organizationId` is truthy.
    if (!user.organizationId) {
        // Study: Stop this execution path by throwing `new ForbiddenError("This operation requires an organization context.")`.
        throw new ForbiddenError("This operation requires an organization context.");
    // Study: Close the code block.
    }

    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer = await customerRepository.findCustomerByIdAndOrganization(
        // Study: Supply `customerId` to the surrounding statement.
        customerId,
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: Close the call arguments.
    );

    // Study: Run the following branch when `!customer` is truthy.
    if (!customer) {
        // Study: Stop this execution path by throwing `new NotFoundError("Customer not found.")`.
        throw new NotFoundError("Customer not found.");
    // Study: Close the code block.
    }

    // Study: Run the following branch when `data.isPrimary` is truthy.
    if (data.isPrimary) {
        // Handle atomic primary switch
        // Study: Return `await prisma.$transaction(async (tx) => { // Unset existing primary contact(s) for …` to the caller.
        return await prisma.$transaction(async (tx) => {
            // Unset existing primary contact(s) for this customer via the repository
            // Study: Call `customerContactRepository.unsetPrimaryContacts` and wait for it to finish.
            await customerContactRepository.unsetPrimaryContacts(customerId, undefined, tx);

            // Create the new primary contact via the repository
            // Study: Return `await customerContactRepository.createCustomerContact(customerId, data, tx)` to the caller.
            return await customerContactRepository.createCustomerContact(customerId, data, tx);
        // Study: Close the code block.
        });
    // Study: Close the code block.
    }

    // Study: Return `await customerContactRepository.createCustomerContact(customerId, data)` to the caller.
    return await customerContactRepository.createCustomerContact(customerId, data);
// Study: Close the code block.
};

// Study: Export `getCustomerContacts` as an async function that returns a promise.
export const getCustomerContacts = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `customer` to `user.systemRole === "SUPER_ADMIN" ? await customerRepository.findPlatformCustomerBy…`.
    const customer = user.systemRole === "SUPER_ADMIN"
        // Study: Use this value when the preceding condition is truthy.
        ? await customerRepository.findPlatformCustomerById(customerId)
        // Study: Use this value when the preceding condition is falsy.
        : user.organizationId
            // Study: Use this value when the preceding condition is truthy.
            ? await customerRepository.findCustomerByIdAndOrganization(customerId, user.organizationId)
            // Study: Use this value when the preceding condition is falsy.
            : null;

    // Study: Run the following branch when `!customer` is truthy.
    if (!customer) {
        // Study: Stop this execution path by throwing `new NotFoundError("Customer not found.")`.
        throw new NotFoundError("Customer not found.");
    // Study: Close the code block.
    }

    // Study: Return `await customerContactRepository.findContactsByCustomerId(customerId)` to the caller.
    return await customerContactRepository.findContactsByCustomerId(customerId);
// Study: Close the code block.
};

// Study: Export `getCustomerContactById` as an async function that returns a promise.
export const getCustomerContactById = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `contactId` with type `string`.
    contactId: string,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Set `customer` to `user.systemRole === "SUPER_ADMIN" ? await customerRepository.findPlatformCustomerBy…`.
    const customer = user.systemRole === "SUPER_ADMIN"
        // Study: Use this value when the preceding condition is truthy.
        ? await customerRepository.findPlatformCustomerById(customerId)
        // Study: Use this value when the preceding condition is falsy.
        : user.organizationId
            // Study: Use this value when the preceding condition is truthy.
            ? await customerRepository.findCustomerByIdAndOrganization(customerId, user.organizationId)
            // Study: Use this value when the preceding condition is falsy.
            : null;

    // Study: Run the following branch when `!customer` is truthy.
    if (!customer) {
        // Study: Stop this execution path by throwing `new NotFoundError("Customer not found.")`.
        throw new NotFoundError("Customer not found.");
    // Study: Close the code block.
    }

    // Study: Call `customerContactRepository.findContactByIdAndCustomer` and wait for it to finish and store its result in `contact`.
    const contact = await customerContactRepository.findContactByIdAndCustomer(contactId, customerId);

    // Study: Run the following branch when `!contact` is truthy.
    if (!contact) {
        // Study: Stop this execution path by throwing `new NotFoundError("Customer contact not found.")`.
        throw new NotFoundError("Customer contact not found.");
    // Study: Close the code block.
    }

    // Study: Return `contact` to the caller.
    return contact;
// Study: Close the code block.
};

// Study: Export `updateCustomerContact` as an async function that returns a promise.
export const updateCustomerContact = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `contactId` with type `string`.
    contactId: string,
    // Study: Accept `data` with type `UpdateCustomerContactInput`.
    data: UpdateCustomerContactInput,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run the following branch when `!user.organizationId` is truthy and throw `new ForbiddenError("This operation requires an organization context.")`.
    if (!user.organizationId) throw new ForbiddenError("This operation requires an organization context.");
    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer = await customerRepository.findCustomerByIdAndOrganization(customerId, user.organizationId);

    // Study: Run the following branch when `!customer` is truthy.
    if (!customer) {
        // Study: Stop this execution path by throwing `new NotFoundError("Customer not found.")`.
        throw new NotFoundError("Customer not found.");
    // Study: Close the code block.
    }

    // Verify contact actually exists and belongs to this customer
    // Study: Call `customerContactRepository.findContactByIdAndCustomer` and wait for it to finish and store its result in `existingContact`.
    const existingContact = await customerContactRepository.findContactByIdAndCustomer(contactId, customerId);
    // Study: Run the following branch when `!existingContact` is truthy.
    if (!existingContact) {
        // Study: Stop this execution path by throwing `new NotFoundError("Customer contact not found.")`.
        throw new NotFoundError("Customer contact not found.");
    // Study: Close the code block.
    }

    // Study: Run the following branch when `data.isPrimary === true` is truthy.
    if (data.isPrimary === true) {
        // Atomic switch: unset previous primary, set this one to primary
        // Study: Return `await prisma.$transaction(async (tx) => { // Ensure any other primary contact is se…` to the caller.
        return await prisma.$transaction(async (tx) => {
            // Ensure any other primary contact is set to false via the repository
            // Study: Call `customerContactRepository.unsetPrimaryContacts` and wait for it to finish.
            await customerContactRepository.unsetPrimaryContacts(customerId, contactId, tx);
            
            // Update the target contact via the repository
            // Study: Call `customerContactRepository.updateCustomerContact` and wait for it to finish and store its result in `updatedContact`.
            const updatedContact = await customerContactRepository.updateCustomerContact(contactId, customerId, data, tx);

            // Study: Run the following branch when `!updatedContact` is truthy.
            if (!updatedContact) {
                // Study: Stop this execution path by throwing `new NotFoundError("Customer contact not found.")`.
                throw new NotFoundError("Customer contact not found.");
            // Study: Close the code block.
            }

            // Study: Return `updatedContact` to the caller.
            return updatedContact;
        // Study: Close the code block.
        });
    // Study: Close the code block.
    }

    // Normal update (isPrimary is false or undefined)
    // Study: Call `customerContactRepository.updateCustomerContact` and wait for it to finish and store its result in `updatedContact`.
    const updatedContact = await customerContactRepository.updateCustomerContact(contactId, customerId, data);
    
    // Study: Run the following branch when `!updatedContact` is truthy.
    if (!updatedContact) {
        // Study: Stop this execution path by throwing `new NotFoundError("Customer contact not found.")`.
        throw new NotFoundError("Customer contact not found.");
    // Study: Close the code block.
    }

    // Study: Return `updatedContact` to the caller.
    return updatedContact;
// Study: Close the code block.
};

// Study: Export `deleteCustomerContact` as an async function that returns a promise.
export const deleteCustomerContact = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `contactId` with type `string`.
    contactId: string,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Run the following branch when `!user.organizationId` is truthy and throw `new ForbiddenError("This operation requires an organization context.")`.
    if (!user.organizationId) throw new ForbiddenError("This operation requires an organization context.");
    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer = await customerRepository.findCustomerByIdAndOrganization(customerId, user.organizationId);

    // Study: Run the following branch when `!customer` is truthy.
    if (!customer) {
        // Study: Stop this execution path by throwing `new NotFoundError("Customer not found.")`.
        throw new NotFoundError("Customer not found.");
    // Study: Close the code block.
    }

    // Study: Call `customerContactRepository.deleteCustomerContact` and wait for it to finish and store its result in `deleted`.
    const deleted = await customerContactRepository.deleteCustomerContact(contactId, customerId);
    
    // Study: Run the following branch when `!deleted` is truthy.
    if (!deleted) {
        // Study: Stop this execution path by throwing `new NotFoundError("Customer contact not found.")`.
        throw new NotFoundError("Customer contact not found.");
    // Study: Close the code block.
    }

    // Study: Return `{ message: "Customer contact deleted successfully.", }` to the caller.
    return {
        // Study: Set `message` to `"Customer contact deleted successfully."`.
        message: "Customer contact deleted successfully.",
    // Study: Close the object literal.
    };
// Study: Close the code block.
};
