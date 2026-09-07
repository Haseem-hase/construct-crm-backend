import * as customerRepository from "./customer.repository";

import { CreateCustomerInput, UpdateCustomerInput } from "./customer.types";

import { AuthenticatedUser } from "../../shared/types/authenticated-user";

import { UnauthorizedError } from "../../errors/UnauthorizedError";
import { NotFoundError } from "../../errors/NotFoundError";

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

    const customer = await customerRepository.createCustomer({
        ...data,
        organizationId,
    });

    return customer;
};

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

    const updatedCustomer =
        await customerRepository.updateCustomer(
            customerId,
            user.organizationId,
            data
        );

    return updatedCustomer;
};

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

    await customerRepository.deleteCustomer(customerId, user.organizationId);

    return {
        message: "Customer deleted successfully.",
    };
};