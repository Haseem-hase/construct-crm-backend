// Study: Read and write database records through Prisma for organizations and their owners.
// Study: Import `prisma` from `"../../lib/prisma"`.
import prisma from "../../lib/prisma";
// Study: Import `{ CreateOrganizationInput }` from `"./organization.types"`.
import { CreateOrganizationInput } from "./organization.types";

// Study: Set `organizationSelect` to `{ id: true, name: true, description: true, createdAt: true, updatedAt: true, } as c…`.
const organizationSelect = {
    // Study: Set `id` to `true`.
    id: true,
    // Study: Set `name` to `true`.
    name: true,
    // Study: Set `description` to `true`.
    description: true,
    // Study: Set `createdAt` to `true`.
    createdAt: true,
    // Study: Set `updatedAt` to `true`.
    updatedAt: true,
// Study: Close this group and continue the enclosing expression.
} as const;

// Study: Export `createOrganizationWithOwner` as an async function that returns a promise.
export const createOrganizationWithOwner = async (
    // Study: Accept `data` with type `CreateOrganizationInput`.
    data: CreateOrganizationInput
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `prisma.$transaction(async (tx) => { const organization = await tx.organization.crea…` to the caller.
    return prisma.$transaction(async (tx) => {
        // Study: Insert a new record through `tx.organization` and wait for it to finish and store its result in `organization`.
        const organization = await tx.organization.create({
            // Study: Supply the values to write to the database.
            data: {
                // Study: Set `name` to `data.organizationName`.
                name: data.organizationName,
                // Study: Expand the values from `(data.description !== undefined ? { description: data.description } : {})` into the surrounding collection.
                ...(data.description !== undefined ? { description: data.description } : {}),
            // Study: Close the object literal.
            },
            // Study: Choose which fields Prisma returns using `organizationSelect`.
            select: organizationSelect,
        // Study: Close the object literal.
        });

        // Fetch all global roles
        // Study: Fetch records matching the query through `tx.role` and wait for it to finish and store its result in `globalRoles`.
        const globalRoles = await tx.role.findMany({
            // Study: Set the conditions that database records must match using isGlobal.
            where: { isGlobal: true },
        // Study: Close the object literal.
        });

        // Create OrganizationRole records for each global role
        // Study: Run the following branch when `globalRoles.length > 0` is truthy.
        if (globalRoles.length > 0) {
            // Study: Insert multiple records through `tx.organizationRole` and wait for it to finish.
            await tx.organizationRole.createMany({
                // Study: Set `data` to `globalRoles.map((role) => ({ organizationId: organization.id, roleId: role.id, }))`.
                data: globalRoles.map((role) => ({
                    // Study: Set the organization identifier used for this record or operation using `organization.id`.
                    organizationId: organization.id,
                    // Study: Set `roleId` to `role.id`.
                    roleId: role.id,
                // Study: Close the object literal.
                })),
            // Study: Close the object literal.
            });
        // Study: Close the code block.
        }

        // We need the ID of the OrganizationRole for the owner to assign to the user
        // Study: Fetch the first record that matches the filters through `tx.organizationRole` and wait for it to finish and store its result in `ownerOrgRole`.
        const ownerOrgRole = await tx.organizationRole.findFirst({
            // Study: Set the conditions that database records must match using organizationId, roleId.
            where: {
                // Study: Set the organization identifier used for this record or operation using `organization.id`.
                organizationId: organization.id,
                // Study: Set `roleId` to `data.roleId`.
                roleId: data.roleId, // data.roleId is the global Role.id of ORGANIZATION_OWNER
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        });

        // Study: Run the following branch when `!ownerOrgRole` is truthy.
        if (!ownerOrgRole) {
            // Study: Stop this execution path by throwing `new Error("Failed to assign owner role to the new organization.")`.
            throw new Error("Failed to assign owner role to the new organization.");
        // Study: Close the code block.
        }

        // Study: Insert a new record through `tx.user` and wait for it to finish and store its result in `user`.
        const user = await tx.user.create({
            // Study: Supply the values to write to the database.
            data: {
                // Study: Set `fullName` to `data.fullName`.
                fullName: data.fullName,
                // Study: Set `email` to `data.email`.
                email: data.email,
                // Study: Set `phone` to `data.phone`.
                phone: data.phone,
                // Study: Set `password` to `data.password`.
                password: data.password,
                // Study: Set `organizationRoleId` to `ownerOrgRole.id`.
                organizationRoleId: ownerOrgRole.id,
                // Study: Set the organization identifier used for this record or operation using `organization.id`.
                organizationId: organization.id,
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        });

        // Study: Return `{ organization, user, }` to the caller.
        return {
            // Study: Pass the current `organization` value under the same property name.
            organization,
            // Study: Pass the current `user` value under the same property name.
            user,
        // Study: Close the object literal.
        };
    // Study: Close the code block.
    });
// Study: Close the code block.
};

// Study: Export `findOrganizations` as an async function that returns a promise.
export const findOrganizations = async ({ search, page, pageSize }: {
    // Study: Define `search` as optional with type `string`.
    search?: string;
    // Study: Define `page` with type `number`.
    page: number;
    // Study: Define `pageSize` with type `number`.
    pageSize: number;
// Study: Close this group and continue the enclosing expression.
}) => {
    // Study: Set `where` to `search ? { name: { contains: search, mode: "insensitive" as const } } : {}`.
    const where = search
        // Study: Use this value when the preceding condition is truthy.
        ? { name: { contains: search, mode: "insensitive" as const } }
        // Study: Use this value when the preceding condition is falsy.
        : {};
    // Study: Set `skip` to `(page - 1) * pageSize`.
    const skip = (page - 1) * pageSize;

    // Study: Group the Prisma operations in a transaction so they commit or roll back together and wait for it to finish and store its result in `[organizations, total]`.
    const [organizations, total] = await prisma.$transaction([
        // Study: Fetch records matching the query through `prisma.organization`.
        prisma.organization.findMany({
            // Study: Pass the current `where` value under the same property name.
            where,
            // Study: Choose which fields Prisma returns using `organizationSelect`.
            select: organizationSelect,
            // Study: Set the sort order for the returned records.
            orderBy: [{ createdAt: "desc" }, { id: "asc" }],
            // Study: Pass the current `skip` value under the same property name.
            skip,
            // Study: Limit the number of results returned using `pageSize`.
            take: pageSize,
        // Study: Close the object literal.
        }),
        // Study: Count matching records through `prisma.organization`.
        prisma.organization.count({ where }),
    // Study: Close the array literal.
    ]);

    // Study: Return `{ organizations, pagination: { page, pageSize, total, totalPages: Math.ceil(total /…` to the caller.
    return {
        // Study: Pass the current `organizations` value under the same property name.
        organizations,
        // Study: Start the nested value for `pagination`.
        pagination: {
            // Study: Pass the current `page` value under the same property name.
            page,
            // Study: Pass the current `pageSize` value under the same property name.
            pageSize,
            // Study: Pass the current `total` value under the same property name.
            total,
            // Study: Set `totalPages` to `Math.ceil(total / pageSize)`.
            totalPages: Math.ceil(total / pageSize),
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    };
// Study: Close the code block.
};
