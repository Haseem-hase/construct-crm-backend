import * as customerRepository from "./customer.repository";

import { CreateCustomerInput, UpdateCustomerInput } from "./customer.types";

import { AuthenticatedUser } from "../../shared/types/authenticated-user";

import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { NotFoundError } from "../../errors/NotFoundError";
import { ConflictError } from "../../errors/ConflictError";

//create customer
export const createCustomer = async (
    data: CreateCustomerInput,
    user: AuthenticatedUser
) => {

    if (!user.organizationId) {
        throw new UnauthorizedError(
            "User is not associated with an organization."
        );
    }

    const organizationId = user.organizationId;

    const existingCustomer =
        await customerRepository.findCustomerByCodeAndOrganization(
            data.customerCode,
            organizationId
        );

    if (existingCustomer) {
        throw new ConflictError(
            "Customer code already exists."
        );
    }

    const customer = await customerRepository.createCustomer({
        ...data,
        organizationId,
    });

    return customer;
};

//get customers 
export const getCustomers = async (
    user: AuthenticatedUser
) => {

    if (!user.organizationId) {
        throw new UnauthorizedError(
            "User is not associated with an organization."
        );
    }

    return await customerRepository.findCustomersByOrganizationId(
        user.organizationId
    );
};

//get a customer
export const getCustomerById = async (
    customerId: string,
    user: AuthenticatedUser
) => {

    if (!user.organizationId) {
        throw new UnauthorizedError(
            "User is not associated with an organization."
        );
    }

    const customer =
        await customerRepository.findCustomerByIdAndOrganization(
            customerId,
            user.organizationId
        );

    if (!customer) {
        throw new NotFoundError(
            "Customer not found."
        );
    }

    return customer;
};

//update customer
export const updateCustomer = async (
    customerId: string,
    data: UpdateCustomerInput,
    user: AuthenticatedUser
) => {

    if (!user.organizationId) {
        throw new UnauthorizedError(
            "User is not associated with an organization."
        );
    }

    const customer =
        await customerRepository.findCustomerByIdAndOrganization(
            customerId,
            user.organizationId
        );

    if (!customer) {
        throw new NotFoundError(
            "Customer not found."
        );
    }

    if (
        data.email &&
        data.email !== customer.email
    ) {
        // We will add email uniqueness checking
        // when customer portal authentication is implemented.
    }

    const updatedCustomer =
        await customerRepository.updateCustomer(
            customerId,
            data
        );

    return updatedCustomer;
};

//deleyte acustomer
export const deleteCustomer = async (
    customerId: string,
    user: AuthenticatedUser
) => {

    if (!user.organizationId) {
        throw new UnauthorizedError(
            "User is not associated with an organization."
        );
    }

    const customer =
        await customerRepository.findCustomerByIdAndOrganization(
            customerId,
            user.organizationId
        );

    if (!customer) {
        throw new NotFoundError(
            "Customer not found."
        );
    }

    await customerRepository.deleteCustomer(customerId);

    return {
        message: "Customer deleted successfully.",
    };
};