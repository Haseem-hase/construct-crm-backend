// Study: This file is about customer accounts and which customers belong under a parent customer. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `* as customerRepository` from `"./customer.repository"` so this file can use it.
import * as customerRepository from "./customer.repository";

// Study: Bring in `{ CreateCustomerInput, UpdateCustomerInput }` from `"./customer.types"` so this file can use it.
import { CreateCustomerInput, UpdateCustomerInput } from "./customer.types";

// Study: Bring in `{ AuthenticatedUser }` from `"../../shared/types/authenticated-user"` so this file can use it.
import { AuthenticatedUser } from "../../shared/types/authenticated-user";

// Study: Bring in `{ ForbiddenError }` from `"../../errors/ForbiddenError"` so this file can use it.
import { ForbiddenError } from "../../errors/ForbiddenError";
// Study: Bring in `{ NotFoundError }` from `"../../errors/NotFoundError"` so this file can use it.
import { NotFoundError } from "../../errors/NotFoundError";

// Study: Make `createCustomer` available to other files. Its result arrives after its work finishes.
export const createCustomer = async (
    // Study: This step receives `data`. `CreateCustomerInput` describes what that information should look like.
    data: CreateCustomerInput,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {

    // Study: Do the next step if this check passes: `!user.organizationId`.
    if (!user.organizationId) {
        // Study: Stop here and pass the problem onward: `new ForbiddenError( "User is not associated with an organization." )`.
        throw new ForbiddenError(
            // Study: Supply the literal string `"User is not associated with an organization."` here.
            "User is not associated with an organization."
        // Study: Close the current group.
        );
    // Study: End this group of steps.
    }

    // Study: Set `organizationId` to `user.organizationId`.
    const organizationId = user.organizationId;

    // Study: Call `customerRepository.createCustomer` and wait for it to finish and store its result in `customer`.
    const customer = await customerRepository.createCustomer({
        // Study: Expand the values from `data` into the surrounding collection.
        ...data,
        // Study: Carry the value of `organizationId` into the new group under the same name.
        organizationId,
    // Study: End this group of values.
    });

    // Study: Give `customer` back to the code that asked for it.
    return customer;
// Study: End this group of steps.
};

// Study: Make `getCustomers` available to other files. Its result arrives after its work finishes.
export const getCustomers = async (
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {

    // Study: Do the next step if this check passes: `user.systemRole === "SUPER_ADMIN"`.
    if (user.systemRole === "SUPER_ADMIN") {
        // Study: Give `customerRepository.findAllPlatformCustomers()` back to the code that asked for it.
        return customerRepository.findAllPlatformCustomers();
    // Study: End this group of steps.
    }
    // Study: Do the next step if this check passes: `!user.organizationId`.
    if (!user.organizationId) {
        // Study: Stop here and pass the problem onward: `new ForbiddenError( "User is not associated with an organization." )`.
        throw new ForbiddenError(
            // Study: Supply the literal string `"User is not associated with an organization."` here.
            "User is not associated with an organization."
        // Study: Close the current group.
        );
    // Study: End this group of steps.
    }

    // Study: Give `await customerRepository.findCustomersByOrganizationId( user.organizationId )` back to the code that asked for it.
    return await customerRepository.findCustomersByOrganizationId(
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: End the list of information being sent to this step.
    );
// Study: End this group of steps.
};

// Study: Make `getCustomerById` available to other files. Its result arrives after its work finishes.
export const getCustomerById = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {

    // Study: Do the next step if this check passes: `user.systemRole === "SUPER_ADMIN"`.
    if (user.systemRole === "SUPER_ADMIN") {
        // Study: Call `customerRepository.findPlatformCustomerById` and wait for it to finish and store its result in `customer`.
        const customer = await customerRepository.findPlatformCustomerById(customerId);
        // Study: Do the next step if there is no value for `customer` . If so, stop and report "Customer not found."
        if (!customer) throw new NotFoundError("Customer not found.");
        // Study: Give `customer` back to the code that asked for it.
        return customer;
    // Study: End this group of steps.
    }
    // Study: Do the next step if this check passes: `!user.organizationId`.
    if (!user.organizationId) {
        // Study: Stop here and pass the problem onward: `new ForbiddenError( "User is not associated with an organization." )`.
        throw new ForbiddenError(
            // Study: Supply the literal string `"User is not associated with an organization."` here.
            "User is not associated with an organization."
        // Study: Close the current group.
        );
    // Study: End this group of steps.
    }

    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer =
        // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish.
        await customerRepository.findCustomerByIdAndOrganization(
            // Study: Supply `customerId` to the surrounding statement.
            customerId,
            // Study: Supply `user` to the surrounding statement.
            user.organizationId
        // Study: End the list of information being sent to this step.
        );

    // Study: Do the next step if there is no value for `customer`.
    if (!customer) {
        // Study: Stop here and pass the problem onward: `new NotFoundError( "Customer not found." )`.
        throw new NotFoundError(
            // Study: Supply the literal string `"Customer not found."` here.
            "Customer not found."
        // Study: Close the current group.
        );
    // Study: End this group of steps.
    }

    // Study: Give `customer` back to the code that asked for it.
    return customer;
// Study: End this group of steps.
};

// Study: Make `getCustomerChildren` available to other files. Its result arrives after its work finishes.
export const getCustomerChildren = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {

    // Study: Do the next step if this check passes: `user.systemRole === "SUPER_ADMIN"`.
    if (user.systemRole === "SUPER_ADMIN") {
        // Study: Call `customerRepository.findPlatformCustomerById` and wait for it to finish and store its result in `customer`.
        const customer = await customerRepository.findPlatformCustomerById(customerId);
        // Study: Do the next step if there is no value for `customer` . If so, stop and report "Customer not found."
        if (!customer) throw new NotFoundError("Customer not found.");
        // Study: Give `customerRepository.findCustomerDescendants(customerId, customer.organizationId)` back to the code that asked for it.
        return customerRepository.findCustomerDescendants(customerId, customer.organizationId);
    // Study: End this group of steps.
    }
    // Study: Do the next step if this check passes: `!user.organizationId`.
    if (!user.organizationId) {
        // Study: Stop here and pass the problem onward: `new ForbiddenError( "User is not associated with an organization." )`.
        throw new ForbiddenError(
            // Study: Supply the literal string `"User is not associated with an organization."` here.
            "User is not associated with an organization."
        // Study: Close the current group.
        );
    // Study: End this group of steps.
    }

    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer =
        // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish.
        await customerRepository.findCustomerByIdAndOrganization(
            // Study: Supply `customerId` to the surrounding statement.
            customerId,
            // Study: Supply `user` to the surrounding statement.
            user.organizationId
        // Study: End the list of information being sent to this step.
        );

    // Study: Do the next step if there is no value for `customer`.
    if (!customer) {
        // Study: Stop here and pass the problem onward: `new NotFoundError( "Customer not found." )`.
        throw new NotFoundError(
            // Study: Supply the literal string `"Customer not found."` here.
            "Customer not found."
        // Study: Close the current group.
        );
    // Study: End this group of steps.
    }

    // Study: Call `customerRepository.findCustomerDescendants` and wait for it to finish and store its result in `descendants`.
    const descendants = await customerRepository.findCustomerDescendants(
        // Study: Supply `customerId` to the surrounding statement.
        customerId,
        // Study: Supply `user` to the surrounding statement.
        user.organizationId
    // Study: End the list of information being sent to this step.
    );

    // Study: Give `descendants` back to the code that asked for it.
    return descendants;
// Study: End this group of steps.
};

// Study: Make `updateCustomer` available to other files. Its result arrives after its work finishes.
export const updateCustomer = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `data`. `UpdateCustomerInput` describes what that information should look like.
    data: UpdateCustomerInput,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {

    // Study: Do the next step if this check passes: `!user.organizationId`.
    if (!user.organizationId) {
        // Study: Stop here and pass the problem onward: `new ForbiddenError( "User is not associated with an organization." )`.
        throw new ForbiddenError(
            // Study: Supply the literal string `"User is not associated with an organization."` here.
            "User is not associated with an organization."
        // Study: Close the current group.
        );
    // Study: End this group of steps.
    }

    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer =
        // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish.
        await customerRepository.findCustomerByIdAndOrganization(
            // Study: Supply `customerId` to the surrounding statement.
            customerId,
            // Study: Supply `user` to the surrounding statement.
            user.organizationId
        // Study: End the list of information being sent to this step.
        );

    // Study: Do the next step if there is no value for `customer`.
    if (!customer) {
        // Study: Stop here and pass the problem onward: `new NotFoundError( "Customer not found." )`.
        throw new NotFoundError(
            // Study: Supply the literal string `"Customer not found."` here.
            "Customer not found."
        // Study: Close the current group.
        );
    // Study: End this group of steps.
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
        // Study: End the list of information being sent to this step.
        );

    // Study: Give `updatedCustomer` back to the code that asked for it.
    return updatedCustomer;
// Study: End this group of steps.
};

// Study: Make `deleteCustomer` available to other files. Its result arrives after its work finishes.
export const deleteCustomer = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `user`. `AuthenticatedUser` describes what that information should look like.
    user: AuthenticatedUser
// Study: Finish this group and continue the surrounding step.
) => {

    // Study: Do the next step if this check passes: `!user.organizationId`.
    if (!user.organizationId) {
        // Study: Stop here and pass the problem onward: `new ForbiddenError( "User is not associated with an organization." )`.
        throw new ForbiddenError(
            // Study: Supply the literal string `"User is not associated with an organization."` here.
            "User is not associated with an organization."
        // Study: Close the current group.
        );
    // Study: End this group of steps.
    }

    // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish and store its result in `customer`.
    const customer =
        // Study: Call `customerRepository.findCustomerByIdAndOrganization` and wait for it to finish.
        await customerRepository.findCustomerByIdAndOrganization(
            // Study: Supply `customerId` to the surrounding statement.
            customerId,
            // Study: Supply `user` to the surrounding statement.
            user.organizationId
        // Study: End the list of information being sent to this step.
        );

    // Study: Do the next step if there is no value for `customer`.
    if (!customer) {
        // Study: Stop here and pass the problem onward: `new NotFoundError( "Customer not found." )`.
        throw new NotFoundError(
            // Study: Supply the literal string `"Customer not found."` here.
            "Customer not found."
        // Study: Close the current group.
        );
    // Study: End this group of steps.
    }

    // Study: Call `customerRepository.deleteCustomer` and wait for it to finish.
    await customerRepository.deleteCustomer(customerId, user.organizationId);

    // Study: Give `{ message: "Customer deleted successfully.", }` back to the code that asked for it.
    return {
        // Study: Set `message` to `"Customer deleted successfully."`.
        message: "Customer deleted successfully.",
    // Study: End this group of values.
    };
// Study: End this group of steps.
};
