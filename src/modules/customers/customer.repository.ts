// Study: This file is about customer accounts and which customers belong under a parent customer. Finds or saves information in the database, where the CRM keeps its records.
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";

// Study: Bring in `{ CreateCustomerInput, UpdateCustomerInput, }` from `"./customer.types"` so this file can use it.
import {
    // Study: Make `CreateCustomerInput` from the other file available here.
    CreateCustomerInput,
    // Study: Make `UpdateCustomerInput` from the other file available here.
    UpdateCustomerInput,
// Study: Finish this group and continue the surrounding step.
} from "./customer.types";


// Study: Make `createCustomer` available to other files. Its result arrives after its work finishes.
export const createCustomer = async (
    // Study: This step receives `data`. `CreateCustomerInput & { organizationId: string; }` describes what that information should look like.
    data: CreateCustomerInput & {
        // Study: Define `organizationId` with type `string`.
        organizationId: string;
    // Study: Close the object type.
    }
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.customer.create({ data: { name: data.name, type: data.type, profileIma…` back to the code that asked for it.
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
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};


// Study: Make `findCustomersByOrganizationId` available to other files. Its result arrives after its work finishes.
export const findCustomersByOrganizationId = async (
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.customer.findMany({ where: { organizationId, }, orderBy: { createdAt: …` back to the code that asked for it.
    return await prisma.customer.findMany({
        // Study: Set the conditions that records must meet using organizationId.
        where: {
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },
        // Study: Set the sort order for the returned records.
        orderBy: {
            // Study: Set `createdAt` to `"desc"`.
            createdAt: "desc",
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findAllPlatformCustomers` available to other files. Its result arrives after its work finishes.
export const findAllPlatformCustomers = async () => prisma.customer.findMany({
    // Study: Ask for linked information along with the main record.
    include: { organization: { select: { id: true, name: true } } },
    // Study: Set the sort order for the returned records.
    orderBy: { createdAt: "desc" },
// Study: End this group of values.
});

// Study: Make `findPlatformCustomerById` available to other files. Its result arrives after its work finishes.
export const findPlatformCustomerById = async (customerId: string) => prisma.customer.findUnique({
    // Study: Set the conditions that records must meet using id.
    where: { id: customerId },
    // Study: Ask for linked information along with the main record.
    include: { organization: { select: { id: true, name: true } } },
// Study: End this group of values.
});


// Study: Make `findCustomerByIdAndOrganization` available to other files. Its result arrives after its work finishes.
export const findCustomerByIdAndOrganization = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.customer.findFirst({ where: { id: customerId, organizationId, }, })` back to the code that asked for it.
    return await prisma.customer.findFirst({
        // Study: Set the conditions that records must meet using id, organizationId.
        where: {
            // Study: Set `id` to `customerId`.
            id: customerId,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findCustomerDescendants` available to other files. Its result arrives after its work finishes.
export const findCustomerDescendants = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
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

    // Study: Give `descendants` back to the code that asked for it.
    return descendants;
// Study: End this group of steps.
};



// Study: Make `updateCustomer` available to other files. Its result arrives after its work finishes.
export const updateCustomer = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string,
    // Study: This step receives `data`. `UpdateCustomerInput` describes what that information should look like.
    data: UpdateCustomerInput
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Update all records matching the filters through `prisma.customer` and wait for it to finish and store its result in `result`.
    const result = await prisma.customer.updateMany({
        // Study: Set the conditions that records must meet using id, organizationId.
        where: {
            // Study: Set `id` to `customerId`.
            id: customerId,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },
        // Study: Supply the values to write to the database.
        data: {
            // Study: Expand the values from `data` into the surrounding collection.
            ...data,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });

    // Study: Do the next step if this check passes: `result.count === 0`.
    if (result.count === 0) {
        // Study: Give `null` back to the code that asked for it.
        return null;
    // Study: End this group of steps.
    }

    // Study: Give `await prisma.customer.findFirst({ where: { id: customerId, organizationId } })` back to the code that asked for it.
    return await prisma.customer.findFirst({
        // Study: Set the conditions that records must meet using id, organizationId.
        where: { 
            // Study: Set `id` to `customerId`.
            id: customerId,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId
        // Study: End this group of values.
        }
    // Study: End this group of values.
    });
// Study: End this group of steps.
};


// Study: Make `deleteCustomer` available to other files. Its result arrives after its work finishes.
export const deleteCustomer = async (
    // Study: This step receives `customerId`. `string` describes what that information should look like.
    customerId: string,
    // Study: This step receives `organizationId`. `string` describes what that information should look like.
    organizationId: string
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Delete records matching the filters through `prisma.customer` and wait for it to finish and store its result in `result`.
    const result = await prisma.customer.deleteMany({
        // Study: Set the conditions that records must meet using id, organizationId.
        where: {
            // Study: Set `id` to `customerId`.
            id: customerId,
            // Study: Carry the value of `organizationId` into the new group under the same name.
            organizationId,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
    
    // Study: Give `result.count > 0` back to the code that asked for it.
    return result.count > 0;
// Study: End this group of steps.
};
