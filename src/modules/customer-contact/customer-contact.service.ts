// Study: This file is about the people you can contact at a customer account. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `* as customerContactRepository` from `"./customer-contact.repository"` so this file can use it.
import * as customerContactRepository from "./customer-contact.repository";
// Study: Bring in `* as customerRepository` from `"../customers/customer.repository"` so this file can use it.
import * as customerRepository from "../customers/customer.repository";
// Study: Bring in `{ CreateCustomerContactInput, UpdateCustomerContactInput }` from `"./customer-contact.types"` so this file can use it.
import { CreateCustomerContactInput, UpdateCustomerContactInput } from "./customer-contact.types";
// Study: Bring in `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"` so this file can use it.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
// Study: Bring in `{ ForbiddenError }` from `"../../errors/ForbiddenError"` so this file can use it.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Bring in `{ NotFoundError }` from `"../../errors/NotFoundError"` so this file can use it.
import { NotFoundError } from "../../errors/NotFoundError";
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";

// Study: Make `createCustomerContact` available to other files. Its result arrives after its work finishes.
export const createCustomerContact = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `data`. `CreateCustomerContactInput` describes what that information should look like.
    data: CreateCustomerContactInput,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Do the next step if this check passes: `!user.organizationId`.
    if (!user.organizationId) {
        // Study: Stop here and report this problem: "This operation requires an organization context."
        throw new ForbiddenError("This operation requires an organization context.");
    // Study: End this group of steps.
    }

    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer = await customerRepository.findCustomerByIdAndOrganization(
        // Study: Supply `customerId` to the surrounding statement.
        customerId,
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: End the list of information being sent to this step.
    );

    // Study: Do the next step if there is no value for `customer`.
    if (!customer) {
        // Study: Stop here and report this problem: "Customer not found."
        throw new NotFoundError("Customer not found.");
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `data.isPrimary`.
    if (data.isPrimary) {
        // Handle atomic primary switch
        // Study: Give `await prisma.$transaction(async (tx) => { // Unset existing primary contact(s) for …` back to the code that asked for it.
        return await prisma.$transaction(async (tx) => {
            // Unset existing primary contact(s) for this customer via the repository
            // Study: Call `customerContactRepository.unsetPrimaryContacts` and wait for it to finish.
            await customerContactRepository.unsetPrimaryContacts(customerId, undefined, tx);

            // Create the new primary contact via the repository
            // Study: Give `await customerContactRepository.createCustomerContact(customerId, data, tx)` back to the code that asked for it.
            return await customerContactRepository.createCustomerContact(customerId, data, tx);
        // Study: End this group of steps.
        });
    // Study: End this group of steps.
    }

    // Study: Give `await customerContactRepository.createCustomerContact(customerId, data)` back to the code that asked for it.
    return await customerContactRepository.createCustomerContact(customerId, data);
// Study: End this group of steps.
};

// Study: Make `getCustomerContacts` available to other files. Its result arrives after its work finishes.
export const getCustomerContacts = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `customer` to `user.systemRole === "SUPER_ADMIN" ? await customerRepository.findPlatformCustomerBy…`.
    const customer = user.systemRole === "SUPER_ADMIN"
        // Study: Use this value if the check above passes.
        ? await customerRepository.findPlatformCustomerById(customerId)
        // Study: Use this value if the check above fails.
        : user.organizationId
            // Study: Use this value if the check above passes.
            ? await customerRepository.findCustomerByIdAndOrganization(customerId, user.organizationId)
            // Study: Use this value if the check above fails.
            : null;

    // Study: Do the next step if there is no value for `customer`.
    if (!customer) {
        // Study: Stop here and report this problem: "Customer not found."
        throw new NotFoundError("Customer not found.");
    // Study: End this group of steps.
    }

    // Study: Give `await customerContactRepository.findContactsByCustomerId(customerId)` back to the code that asked for it.
    return await customerContactRepository.findContactsByCustomerId(customerId);
// Study: End this group of steps.
};

// Study: Make `getCustomerContactById` available to other files. Its result arrives after its work finishes.
export const getCustomerContactById = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `contactId`. `string` describes what that information should look like.
    contactId: string,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Set `customer` to `user.systemRole === "SUPER_ADMIN" ? await customerRepository.findPlatformCustomerBy…`.
    const customer = user.systemRole === "SUPER_ADMIN"
        // Study: Use this value if the check above passes.
        ? await customerRepository.findPlatformCustomerById(customerId)
        // Study: Use this value if the check above fails.
        : user.organizationId
            // Study: Use this value if the check above passes.
            ? await customerRepository.findCustomerByIdAndOrganization(customerId, user.organizationId)
            // Study: Use this value if the check above fails.
            : null;

    // Study: Do the next step if there is no value for `customer`.
    if (!customer) {
        // Study: Stop here and report this problem: "Customer not found."
        throw new NotFoundError("Customer not found.");
    // Study: End this group of steps.
    }

    // Study: Call `customerContactRepository.findContactByIdAndCustomer` and wait for it to finish and store its result in `contact`.
    const contact = await customerContactRepository.findContactByIdAndCustomer(contactId, customerId);

    // Study: Do the next step if there is no value for `contact`.
    if (!contact) {
        // Study: Stop here and report this problem: "Customer contact not found."
        throw new NotFoundError("Customer contact not found.");
    // Study: End this group of steps.
    }

    // Study: Give `contact` back to the code that asked for it.
    return contact;
// Study: End this group of steps.
};

// Study: Make `updateCustomerContact` available to other files. Its result arrives after its work finishes.
export const updateCustomerContact = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `contactId`. `string` describes what that information should look like.
    contactId: string,
    // Study: This step receives `data`. `UpdateCustomerContactInput` describes what that information should look like.
    data: UpdateCustomerContactInput,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Do the next step if this check passes: `!user.organizationId` . If so, stop and report "This operation requires an organization context."
    if (!user.organizationId) throw new ForbiddenError("This operation requires an organization context.");
    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer = await customerRepository.findCustomerByIdAndOrganization(customerId, user.organizationId);

    // Study: Do the next step if there is no value for `customer`.
    if (!customer) {
        // Study: Stop here and report this problem: "Customer not found."
        throw new NotFoundError("Customer not found.");
    // Study: End this group of steps.
    }

    // Verify contact actually exists and belongs to this customer
    // Study: Call `customerContactRepository.findContactByIdAndCustomer` and wait for it to finish and store its result in `existingContact`.
    const existingContact = await customerContactRepository.findContactByIdAndCustomer(contactId, customerId);
    // Study: Do the next step if there is no value for `existingContact`.
    if (!existingContact) {
        // Study: Stop here and report this problem: "Customer contact not found."
        throw new NotFoundError("Customer contact not found.");
    // Study: End this group of steps.
    }

    // Study: Do the next step if this check passes: `data.isPrimary === true`.
    if (data.isPrimary === true) {
        // Atomic switch: unset previous primary, set this one to primary
        // Study: Give `await prisma.$transaction(async (tx) => { // Ensure any other primary contact is se…` back to the code that asked for it.
        return await prisma.$transaction(async (tx) => {
            // Ensure any other primary contact is set to false via the repository
            // Study: Call `customerContactRepository.unsetPrimaryContacts` and wait for it to finish.
            await customerContactRepository.unsetPrimaryContacts(customerId, contactId, tx);
            
            // Update the target contact via the repository
            // Study: Call `customerContactRepository.updateCustomerContact` and wait for it to finish and store its result in `updatedContact`.
            const updatedContact = await customerContactRepository.updateCustomerContact(contactId, customerId, data, tx);

            // Study: Do the next step if there is no value for `updatedContact`.
            if (!updatedContact) {
                // Study: Stop here and report this problem: "Customer contact not found."
                throw new NotFoundError("Customer contact not found.");
            // Study: End this group of steps.
            }

            // Study: Give `updatedContact` back to the code that asked for it.
            return updatedContact;
        // Study: End this group of steps.
        });
    // Study: End this group of steps.
    }

    // Normal update (isPrimary is false or undefined)
    // Study: Call `customerContactRepository.updateCustomerContact` and wait for it to finish and store its result in `updatedContact`.
    const updatedContact = await customerContactRepository.updateCustomerContact(contactId, customerId, data);
    
    // Study: Do the next step if there is no value for `updatedContact`.
    if (!updatedContact) {
        // Study: Stop here and report this problem: "Customer contact not found."
        throw new NotFoundError("Customer contact not found.");
    // Study: End this group of steps.
    }

    // Study: Give `updatedContact` back to the code that asked for it.
    return updatedContact;
// Study: End this group of steps.
};

// Study: Make `deleteCustomerContact` available to other files. Its result arrives after its work finishes.
export const deleteCustomerContact = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `contactId`. `string` describes what that information should look like.
    contactId: string,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Do the next step if this check passes: `!user.organizationId` . If so, stop and report "This operation requires an organization context."
    if (!user.organizationId) throw new ForbiddenError("This operation requires an organization context.");
    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer = await customerRepository.findCustomerByIdAndOrganization(customerId, user.organizationId);

    // Study: Do the next step if there is no value for `customer`.
    if (!customer) {
        // Study: Stop here and report this problem: "Customer not found."
        throw new NotFoundError("Customer not found.");
    // Study: End this group of steps.
    }

    // Study: Call `customerContactRepository.deleteCustomerContact` and wait for it to finish and store its result in `deleted`.
    const deleted = await customerContactRepository.deleteCustomerContact(contactId, customerId);
    
    // Study: Do the next step if there is no value for `deleted`.
    if (!deleted) {
        // Study: Stop here and report this problem: "Customer contact not found."
        throw new NotFoundError("Customer contact not found.");
    // Study: End this group of steps.
    }

    // Study: Give `{ message: "Customer contact deleted successfully.", }` back to the code that asked for it.
    return {
        // Study: Set `message` to `"Customer contact deleted successfully."`.
        message: "Customer contact deleted successfully.",
    // Study: End this group of values.
    };
// Study: End this group of steps.
};
