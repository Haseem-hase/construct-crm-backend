// Study: Read and write database records through Prisma for customer accounts and parent-child customer relationships.
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";

// Study: Import `{ CreateCustomerInput, UpdateCustomerInput, }` from `"./customer.types"`.
import {
    // Study: Bring `CreateCustomerInput` into scope from the imported module.
    CreateCustomerInput,
    // Study: Bring `UpdateCustomerInput` into scope from the imported module.
    UpdateCustomerInput,
// Study: Close this group and continue the enclosing expression.
} from "./customer.types";


// Study: Export `createCustomer` as an async function that returns a promise.
export const createCustomer = async (
    // Study: Accept `data` with type `CreateCustomerInput & { organizationId: string; }`.
    data: CreateCustomerInput & {
        // Study: Define `organizationId` with type `string`.
        organizationId: string;
    // Study: Close the object type.
    }
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.customer.create({ data: { name: data.name, type: data.type, profileIma…` to the caller.
    return await prisma.customer.create({
        // Study: Supply the values to write to the database.
        data: {
            // Study: Set `name` to `data.name`.
            name: data.name,
            // Study: Set `type` to `data.type`.
            type: data.type,
            // Study: Set `profileImageUrl` to `data.profileImageUrl`.
            profileImageUrl: data.profileImageUrl,
            
            // Study: Set `country` to `data.country`.
            country: data.country,
            // Study: Set `city` to `data.city`.
            city: data.city,
            // Study: Set `address` to `data.address`.
            address: data.address,
            
            // Study: Set `parentCustomerId` to `data.parentCustomerId`.
            parentCustomerId: data.parentCustomerId,
            
            // Study: Set the organization identifier used for this record or operation using `data.organizationId`.
            organizationId: data.organizationId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};


// Study: Export `findCustomersByOrganizationId` as an async function that returns a promise.
export const findCustomersByOrganizationId = async (
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.customer.findMany({ where: { organizationId, }, orderBy: { createdAt: …` to the caller.
    return await prisma.customer.findMany({
        // Study: Set the conditions that database records must match using organizationId.
        where: {
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `createdAt` to `"desc"`.
            createdAt: "desc",
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findAllPlatformCustomers` as an async function that returns a promise.
export const findAllPlatformCustomers = async () => prisma.customer.findMany({
    // Study: Load related database records with the main result.
    include: { organization: { select: { id: true, name: true } } },
    // Study: Set the sort order for the returned records.
    orderBy: { createdAt: "desc" },
// Study: Close the object literal.
});

// Study: Export `findPlatformCustomerById` as an async function that returns a promise.
export const findPlatformCustomerById = async (customerId: string) => prisma.customer.findUnique({
    // Study: Set the conditions that database records must match using id.
    where: { id: customerId },
    // Study: Load related database records with the main result.
    include: { organization: { select: { id: true, name: true } } },
// Study: Close the object literal.
});


// Study: Export `findCustomerByIdAndOrganization` as an async function that returns a promise.
export const findCustomerByIdAndOrganization = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.customer.findFirst({ where: { id: customerId, organizationId, }, })` to the caller.
    return await prisma.customer.findFirst({
        // Study: Set the conditions that database records must match using id, organizationId.
        where: {
            // Study: Set `id` to `customerId`.
            id: customerId,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findCustomerDescendants` as an async function that returns a promise.
export const findCustomerDescendants = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // We use a PostgreSQL Recursive CTE to fetch all descendants.
    // The UNION (without ALL) automatically deduplicates, protecting against infinite loops if a data cycle exists.
    // The organizationId filter is rigidly applied at every recursion step to guarantee tenant isolation.
    // Study: The recursive SQL starts with the direct children and repeatedly joins each result to its own children.
    // Study: Both parts filter on organizationId. UNION removes duplicate rows and the final SELECT returns every row reached.
    // Study: Wait for `prisma.$queryRaw' WITH RECURSIVE CustomerHierarchy AS ( -- Anchor member: immediate…` to finish and store its result in `descendants`.
    const descendants = await prisma.$queryRaw`
        WITH RECURSIVE CustomerHierarchy AS (
            -- Anchor member: immediate children of the requested customer
            SELECT *
            FROM "customers"
            WHERE "parentCustomerId" = ${customerId} AND "organizationId" = ${organizationId}
            
            UNION
            
            -- Recursive member: children of the customers found in the previous step
            SELECT c.*
            FROM "customers" c
            INNER JOIN CustomerHierarchy ch ON c."parentCustomerId" = ch.id
            WHERE c."organizationId" = ${organizationId}
        )
        SELECT * FROM CustomerHierarchy;
    `;

    // Study: Return `descendants` to the caller.
    return descendants;
// Study: Close the code block.
};



// Study: Export `updateCustomer` as an async function that returns a promise.
export const updateCustomer = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string,
    // Study: Accept `data` with type `UpdateCustomerInput`.
    data: UpdateCustomerInput
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Update all records matching the filters through `prisma.customer` and wait for it to finish and store its result in `result`.
    const result = await prisma.customer.updateMany({
        // Study: Set the conditions that database records must match using id, organizationId.
        where: {
            // Study: Set `id` to `customerId`.
            id: customerId,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },
        // Study: Supply the values to write to the database.
        data: {
            // Study: Expand the values from `data` into the surrounding collection.
            ...data,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });

    // Study: Run the following branch when `result.count === 0` is truthy.
    if (result.count === 0) {
        // Study: Return `null` to the caller.
        return null;
    // Study: Close the code block.
    }

    // Study: Return `await prisma.customer.findFirst({ where: { id: customerId, organizationId } })` to the caller.
    return await prisma.customer.findFirst({
        // Study: Set the conditions that database records must match using id, organizationId.
        where: { 
            // Study: Set `id` to `customerId`.
            id: customerId,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId
        // Study: Close the object literal.
        }
    // Study: Close the object literal.
    });
// Study: Close the code block.
};


// Study: Export `deleteCustomer` as an async function that returns a promise.
export const deleteCustomer = async (
    // Study: Accept `customerId` with type `string`.
    customerId: string,
    // Study: Accept `organizationId` with type `string`.
    organizationId: string
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Delete records matching the filters through `prisma.customer` and wait for it to finish and store its result in `result`.
    const result = await prisma.customer.deleteMany({
        // Study: Set the conditions that database records must match using id, organizationId.
        where: {
            // Study: Set `id` to `customerId`.
            id: customerId,
            // Study: Pass the current `organizationId` value under the same property name.
            organizationId,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
    
    // Study: Return `result.count > 0` to the caller.
    return result.count > 0;
// Study: Close the code block.
};
