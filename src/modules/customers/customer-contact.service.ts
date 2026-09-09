import * as customerContactRepository from "./customer-contact.repository";
import * as customerRepository from "./customer.repository";
import { CreateCustomerContactInput, UpdateCustomerContactInput } from "./customer-contact.types";
import { AuthenticatedUser } from "../../shared/types/authenticated-user";
import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { NotFoundError } from "../../errors/NotFoundError";
import prisma from "../../lib/prisma";

export const createCustomerContact = async (
    customerId: string,
    data: CreateCustomerContactInput,
    user: AuthenticatedUser
) => {
    if (!user.organizationId) {
        throw new UnauthorizedError("User is not associated with an organization.");
    }

    const customer = await customerRepository.findCustomerByIdAndOrganization(
        customerId,
        user.organizationId
    );

    if (!customer) {
        throw new NotFoundError("Customer not found.");
    }

    if (data.isPrimary) {
        // Handle atomic primary switch
        return await prisma.$transaction(async (tx) => {
            // Unset existing primary contact(s) for this customer via the repository
            await customerContactRepository.unsetPrimaryContacts(customerId, undefined, tx);

            // Create the new primary contact via the repository
            return await customerContactRepository.createCustomerContact(customerId, data, tx);
        });
    }

    return await customerContactRepository.createCustomerContact(customerId, data);
};

export const getCustomerContacts = async (
    customerId: string,
    user: AuthenticatedUser
) => {
    if (!user.organizationId) {
        throw new UnauthorizedError("User is not associated with an organization.");
    }

    const customer = await customerRepository.findCustomerByIdAndOrganization(
        customerId,
        user.organizationId
    );

    if (!customer) {
        throw new NotFoundError("Customer not found.");
    }

    return await customerContactRepository.findContactsByCustomerId(customerId);
};

export const getCustomerContactById = async (
    customerId: string,
    contactId: string,
    user: AuthenticatedUser
) => {
    if (!user.organizationId) {
        throw new UnauthorizedError("User is not associated with an organization.");
    }

    const customer = await customerRepository.findCustomerByIdAndOrganization(
        customerId,
        user.organizationId
    );

    if (!customer) {
        throw new NotFoundError("Customer not found.");
    }

    const contact = await customerContactRepository.findContactByIdAndCustomer(contactId, customerId);

    if (!contact) {
        throw new NotFoundError("Customer contact not found.");
    }

    return contact;
};

export const updateCustomerContact = async (
    customerId: string,
    contactId: string,
    data: UpdateCustomerContactInput,
    user: AuthenticatedUser
) => {
    if (!user.organizationId) {
        throw new UnauthorizedError("User is not associated with an organization.");
    }

    const customer = await customerRepository.findCustomerByIdAndOrganization(
        customerId,
        user.organizationId
    );

    if (!customer) {
        throw new NotFoundError("Customer not found.");
    }

    // Verify contact actually exists and belongs to this customer
    const existingContact = await customerContactRepository.findContactByIdAndCustomer(contactId, customerId);
    if (!existingContact) {
        throw new NotFoundError("Customer contact not found.");
    }

    if (data.isPrimary === true) {
        // Atomic switch: unset previous primary, set this one to primary
        return await prisma.$transaction(async (tx) => {
            // Ensure any other primary contact is set to false via the repository
            await customerContactRepository.unsetPrimaryContacts(customerId, contactId, tx);
            
            // Update the target contact via the repository
            const updatedContact = await customerContactRepository.updateCustomerContact(contactId, customerId, data, tx);

            if (!updatedContact) {
                throw new NotFoundError("Customer contact not found.");
            }

            return updatedContact;
        });
    }

    // Normal update (isPrimary is false or undefined)
    const updatedContact = await customerContactRepository.updateCustomerContact(contactId, customerId, data);
    
    if (!updatedContact) {
        throw new NotFoundError("Customer contact not found.");
    }

    return updatedContact;
};

export const deleteCustomerContact = async (
    customerId: string,
    contactId: string,
    user: AuthenticatedUser
) => {
    if (!user.organizationId) {
        throw new UnauthorizedError("User is not associated with an organization.");
    }

    const customer = await customerRepository.findCustomerByIdAndOrganization(
        customerId,
        user.organizationId
    );

    if (!customer) {
        throw new NotFoundError("Customer not found.");
    }

    const deleted = await customerContactRepository.deleteCustomerContact(contactId, customerId);
    
    if (!deleted) {
        throw new NotFoundError("Customer contact not found.");
    }

    return {
        message: "Customer contact deleted successfully.",
    };
};
