// Study: Apply business rules and coordinate database operations for customer accounts and parent-child customer relationships.
// Study: Import `* as customerRepository` from `"./customer.repository"`.
import * as customerRepository from "./customer.repository";

// Study: Import `{ CreateCustomerInput, UpdateCustomerInput }` from `"./customer.types"`.
import { CreateCustomerInput, UpdateCustomerInput } from "./customer.types";

// Study: Import `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"`.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";

// Study: Import `{ ForbiddenError }` from `"../../errors/ForbiddenError"`.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Import `{ NotFoundError }` from `"../../errors/NotFoundError"`.
import { NotFoundError } from "../../errors/NotFoundError";

// Study: Export `createCustomer` as an async function that returns a promise.
export const createCustomer = async (
    // Study: Accept `data` with type `CreateCustomerInput`.
    data: CreateCustomerInput,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {

    // Study: Run the following branch when `!user.organizationId` is truthy.
    if (!user.organizationId) {
        // Study: Stop this execution path by throwing `new ForbiddenError( "User is not associated with an organization." )`.
        throw new ForbiddenError(
            // Study: Supply the literal string `"User is not associated with an organization."` here.
            "User is not associated with an organization."
        // Study: Close the current group.
        );
    // Study: Close the code block.
    }

    // Study: Set `organizationId` to `user.organizationId`.
    const organizationId = user.organizationId;

    // Study: Call `customerRepository.createCustomer` and wait for it to finish and store its result in `customer`.
    const customer = await customerRepository.createCustomer({
        // Study: Expand the values from `data` into the surrounding collection.
        ...data,
        // Study: Pass the current `organizationId` value under the same property name.
        organizationId,
    // Study: Close the object literal.
    });

    // Study: Return `customer` to the caller.
    return customer;
// Study: Close the code block.
};

// Study: Export `getCustomers` as an async function that returns a promise.
export const getCustomers = async (
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {

    // Study: Run the following branch when `user.systemRole === "SUPER_ADMIN"` is truthy.
    if (user.systemRole === "SUPER_ADMIN") {
        // Study: Return `customerRepository.findAllPlatformCustomers()` to the caller.
        return customerRepository.findAllPlatformCustomers();
    // Study: Close the code block.
    }
    // Study: Run the following branch when `!user.organizationId` is truthy.
    if (!user.organizationId) {
        // Study: Stop this execution path by throwing `new ForbiddenError( "User is not associated with an organization." )`.
        throw new ForbiddenError(
            // Study: Supply the literal string `"User is not associated with an organization."` here.
            "User is not associated with an organization."
        // Study: Close the current group.
        );
    // Study: Close the code block.
    }

    // Study: Return `await customerRepository.findCustomersByOrganizationId( user.organizationId )` to the caller.
    return await customerRepository.findCustomersByOrganizationId(
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: Close the call arguments.
    );
// Study: Close the code block.
};

// Study: Export `getCustomerById` as an async function that returns a promise.
export const getCustomerById = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {

    // Study: Run the following branch when `user.systemRole === "SUPER_ADMIN"` is truthy.
    if (user.systemRole === "SUPER_ADMIN") {
        // Study: Call `customerRepository.findPlatformCustomerById` and wait for it to finish and store its result in `customer`.
        const customer = await customerRepository.findPlatformCustomerById(customerId);
        // Study: Run the following branch when `!customer` is truthy and throw `new NotFoundError("Customer not found.")`.
        if (!customer) throw new NotFoundError("Customer not found.");
        // Study: Return `customer` to the caller.
        return customer;
    // Study: Close the code block.
    }
    // Study: Run the following branch when `!user.organizationId` is truthy.
    if (!user.organizationId) {
        // Study: Stop this execution path by throwing `new ForbiddenError( "User is not associated with an organization." )`.
        throw new ForbiddenError(
            // Study: Supply the literal string `"User is not associated with an organization."` here.
            "User is not associated with an organization."
        // Study: Close the current group.
        );
    // Study: Close the code block.
    }

    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer =
        // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish.
        await customerRepository.findCustomerByIdAndOrganization(
            // Study: Supply `customerId` to the surrounding statement.
            customerId,
            // Study: Supply `user` to the surrounding statement.
            user.organizationId
        // Study: Close the call arguments.
        );

    // Study: Run the following branch when `!customer` is truthy.
    if (!customer) {
        // Study: Stop this execution path by throwing `new NotFoundError( "Customer not found." )`.
        throw new NotFoundError(
            // Study: Supply the literal string `"Customer not found."` here.
            "Customer not found."
        // Study: Close the current group.
        );
    // Study: Close the code block.
    }

    // Study: Return `customer` to the caller.
    return customer;
// Study: Close the code block.
};

// Study: Export `getCustomerChildren` as an async function that returns a promise.
export const getCustomerChildren = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {

    // Study: Run the following branch when `user.systemRole === "SUPER_ADMIN"` is truthy.
    if (user.systemRole === "SUPER_ADMIN") {
        // Study: Call `customerRepository.findPlatformCustomerById` and wait for it to finish and store its result in `customer`.
        const customer = await customerRepository.findPlatformCustomerById(customerId);
        // Study: Run the following branch when `!customer` is truthy and throw `new NotFoundError("Customer not found.")`.
        if (!customer) throw new NotFoundError("Customer not found.");
        // Study: Return `customerRepository.findCustomerDescendants(customerId, customer.organizationId)` to the caller.
        return customerRepository.findCustomerDescendants(customerId, customer.organizationId);
    // Study: Close the code block.
    }
    // Study: Run the following branch when `!user.organizationId` is truthy.
    if (!user.organizationId) {
        // Study: Stop this execution path by throwing `new ForbiddenError( "User is not associated with an organization." )`.
        throw new ForbiddenError(
            // Study: Supply the literal string `"User is not associated with an organization."` here.
            "User is not associated with an organization."
        // Study: Close the current group.
        );
    // Study: Close the code block.
    }

    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer =
        // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish.
        await customerRepository.findCustomerByIdAndOrganization(
            // Study: Supply `customerId` to the surrounding statement.
            customerId,
            // Study: Supply `user` to the surrounding statement.
            user.organizationId
        // Study: Close the call arguments.
        );

    // Study: Run the following branch when `!customer` is truthy.
    if (!customer) {
        // Study: Stop this execution path by throwing `new NotFoundError( "Customer not found." )`.
        throw new NotFoundError(
            // Study: Supply the literal string `"Customer not found."` here.
            "Customer not found."
        // Study: Close the current group.
        );
    // Study: Close the code block.
    }

    // Study: Call `customerRepository.findCustomerDescendants` and wait for it to finish and store its result in `descendants`.
    const descendants = await customerRepository.findCustomerDescendants(
        // Study: Supply `customerId` to the surrounding statement.
        customerId,
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: Close the call arguments.
    );

    // Study: Return `descendants` to the caller.
    return descendants;
// Study: Close the code block.
};

// Study: Export `updateCustomer` as an async function that returns a promise.
export const updateCustomer = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `data` with type `UpdateCustomerInput`.
    data: UpdateCustomerInput,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {

    // Study: Run the following branch when `!user.organizationId` is truthy.
    if (!user.organizationId) {
        // Study: Stop this execution path by throwing `new ForbiddenError( "User is not associated with an organization." )`.
        throw new ForbiddenError(
            // Study: Supply the literal string `"User is not associated with an organization."` here.
            "User is not associated with an organization."
        // Study: Close the current group.
        );
    // Study: Close the code block.
    }

    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer =
        // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish.
        await customerRepository.findCustomerByIdAndOrganization(
            // Study: Supply `customerId` to the surrounding statement.
            customerId,
            // Study: Supply `user` to the surrounding statement.
            user.organizationId
        // Study: Close the call arguments.
        );

    // Study: Run the following branch when `!customer` is truthy.
    if (!customer) {
        // Study: Stop this execution path by throwing `new NotFoundError( "Customer not found." )`.
        throw new NotFoundError(
            // Study: Supply the literal string `"Customer not found."` here.
            "Customer not found."
        // Study: Close the current group.
        );
    // Study: Close the code block.
    }

    // Study: Call `customerRepository.updateCustomer` and wait for it to finish and store its result in `updatedCustomer`.
    const updatedCustomer =
        // Study: Call `customerRepository.updateCustomer` and wait for it to finish.
        await customerRepository.updateCustomer(
            // Study: Supply `customerId` to the surrounding statement.
            customerId,
            // Study: Supply `user` to the surrounding statement.
            user.organizationId,
            // Study: Supply `data` to the surrounding statement.
            data
        // Study: Close the call arguments.
        );

    // Study: Return `updatedCustomer` to the caller.
    return updatedCustomer;
// Study: Close the code block.
};

// Study: Export `deleteCustomer` as an async function that returns a promise.
export const deleteCustomer = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `user` with type `AuthenticatedUser`.
    user: AuthenticatedUser
// Study: Close this group and continue the enclosing expression.
) => {

    // Study: Run the following branch when `!user.organizationId` is truthy.
    if (!user.organizationId) {
        // Study: Stop this execution path by throwing `new ForbiddenError( "User is not associated with an organization." )`.
        throw new ForbiddenError(
            // Study: Supply the literal string `"User is not associated with an organization."` here.
            "User is not associated with an organization."
        // Study: Close the current group.
        );
    // Study: Close the code block.
    }

    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer =
        // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish.
        await customerRepository.findCustomerByIdAndOrganization(
            // Study: Supply `customerId` to the surrounding statement.
            customerId,
            // Study: Supply `user` to the surrounding statement.
            user.organizationId
        // Study: Close the call arguments.
        );

    // Study: Run the following branch when `!customer` is truthy.
    if (!customer) {
        // Study: Stop this execution path by throwing `new NotFoundError( "Customer not found." )`.
        throw new NotFoundError(
            // Study: Supply the literal string `"Customer not found."` here.
            "Customer not found."
        // Study: Close the current group.
        );
    // Study: Close the code block.
    }

    // Study: Call `customerRepository.deleteCustomer` and wait for it to finish.
    await customerRepository.deleteCustomer(customerId, user.organizationId);

    // Study: Return `{ message: "Customer deleted successfully.", }` to the caller.
    return {
        // Study: Set `message` to `"Customer deleted successfully."`.
        message: "Customer deleted successfully.",
    // Study: Close the object literal.
    };
// Study: Close the code block.
};
