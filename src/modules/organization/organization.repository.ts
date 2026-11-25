// Study: This file is about the companies using the CRM and the people who own their accounts. Finds or saves information in the database, where the CRM keeps its records.
// Study: Bring in `prisma` from `"../../lib/prisma"` so this file can use it.
import prisma from "../../lib/prisma";
// Study: Bring in `{ CreateOrganizationInput }` from `"./organization.types"` so this file can use it.
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
// Study: Finish this group and continue the surrounding step.
} as const;

// Study: Make `createOrganizationWithOwner` available to other files. Its result arrives after its work finishes.
export const createOrganizationWithOwner = async (
    // Study: This step receives `data`. `CreateOrganizationInput` describes what that information should look like.
    data: CreateOrganizationInput
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `prisma.$transaction(async (tx) => { const organization = await tx.organization.crea…` back to the code that asked for it.
    return prisma.$transaction(async (tx) => {
        // Study: Insert a new record through `tx.organization` and wait for it to finish and store its result in `organization`.
        const organization = await tx.organization.create({
            // Study: Supply the values to write to the database.
            data: {
                // Study: Set `name` to `data.organizationName`.
                name: data.organizationName,
                // Study: Expand the values from `(data.description !== undefined ? { description: data.description } : {})` into the surrounding collection.
                ...(data.description !== undefined ? { description: data.description } : {}),
            // Study: End this group of values.
            },
            // Study: Choose which details the database gives back using `organizationSelect`.
            select: organizationSelect,
        // Study: End this group of values.
        });

        // Fetch all global roles
        // Study: Find all matching records using `tx.role` and wait for it to finish and store its result in `globalRoles`.
        const globalRoles = await tx.role.findMany({
            // Study: Set the conditions that records must meet using isGlobal.
            where: { isGlobal: true },
        // Study: End this group of values.
        });

        // Create OrganizationRole records for each global role
        // Study: Do the next step if this check passes: `globalRoles.length > 0`.
        if (globalRoles.length > 0) {
            // Study: Insert multiple records through `tx.organizationRole` and wait for it to finish.
            await tx.organizationRole.createMany({
                // Study: Set `data` to `globalRoles.map((role) => ({ organizationId: organization.id, roleId: role.id, }))`.
                data: globalRoles.map((role) => ({
                    // Study: Set the organization identifier used for this record or operation using `organization.id`.
                    organizationId: organization.id,
                    // Study: Set `roleId` to `role.id`.
                    roleId: role.id,
                // Study: End this group of values.
                })),
            // Study: End this group of values.
            });
        // Study: End this group of steps.
        }

        // We need the ID of the OrganizationRole for the owner to assign to the user
        // Study: Find the first record that meets these checks using `tx.organizationRole` and wait for it to finish and store its result in `ownerOrgRole`.
        const ownerOrgRole = await tx.organizationRole.findFirst({
            // Study: Set the conditions that records must meet using organizationId, roleId.
            where: {
                // Study: Set the organization identifier used for this record or operation using `organization.id`.
                organizationId: organization.id,
                // Study: Set `roleId` to `data.roleId`.
                roleId: data.roleId, // data.roleId is the global Role.id of ORGANIZATION_OWNER
            // Study: End this group of values.
            },
        // Study: End this group of values.
        });

        // Study: Do the next step if there is no value for `ownerOrgRole`.
        if (!ownerOrgRole) {
            // Study: Stop here and report this problem: "Failed to assign owner role to the new organization."
            throw new Error("Failed to assign owner role to the new organization.");
        // Study: End this group of steps.
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
            // Study: End this group of values.
            },
        // Study: End this group of values.
        });

        // Study: Give `{ organization, user, }` back to the code that asked for it.
        return {
            // Study: Carry the value of `organization` into the new group under the same name.
            organization,
            // Study: Carry the value of `user` into the new group under the same name.
            user,
        // Study: End this group of values.
        };
    // Study: End this group of steps.
    });
// Study: End this group of steps.
};

// Study: Make `findOrganizations` available to other files. Its result arrives after its work finishes.
export const findOrganizations = async ({ search, page, pageSize }: {
    // Study: Define `search` as optional with type `string`.
    search?: string;
    // Study: Define `page` with type `number`.
    page: number;
    // Study: Define `pageSize` with type `number`.
    pageSize: number;
// Study: Finish this group and continue the surrounding step.
}) => {
    // Study: Set `where` to `search ? { name: { contains: search, mode: "insensitive" as const } } : {}`.
    const where = search
        // Study: Use this value if the check above passes.
        ? { name: { contains: search, mode: "insensitive" as const } }
        // Study: Use this value if the check above fails.
        : {};
    // Study: Set `skip` to `(page - 1) * pageSize`.
    const skip = (page - 1) * pageSize;

    // Study: Group the Prisma operations in a transaction so they commit or roll back together and wait for it to finish and store its result in `[organizations, total]`.
    const [organizations, total] = await prisma.$transaction([
        // Study: Find all matching records using `prisma.organization`.
        prisma.organization.findMany({
            // Study: Carry the value of `where` into the new group under the same name.
            where,
            // Study: Choose which details the database gives back using `organizationSelect`.
            select: organizationSelect,
            // Study: Set the sort order for the returned records.
            orderBy: [{ createdAt: "desc" }, { id: "asc" }],
            // Study: Carry the value of `skip` into the new group under the same name.
            skip,
            // Study: Limit the number of results returned using `pageSize`.
            take: pageSize,
        // Study: End this group of values.
        }),
        // Study: Count matching records through `prisma.organization`.
        prisma.organization.count({ where }),
    // Study: End this group of values.
    ]);

    // Study: Give `{ organizations, pagination: { page, pageSize, total, totalPages: Math.ceil(total /…` back to the code that asked for it.
    return {
        // Study: Carry the value of `organizations` into the new group under the same name.
        organizations,
        // Study: Start the nested value for `pagination`.
        pagination: {
            // Study: Carry the value of `page` into the new group under the same name.
            page,
            // Study: Carry the value of `pageSize` into the new group under the same name.
            pageSize,
            // Study: Carry the value of `total` into the new group under the same name.
            total,
            // Study: Set `totalPages` to `Math.ceil(total / pageSize)`.
            totalPages: Math.ceil(total / pageSize),
        // Study: End this group of values.
        },
    // Study: End this group of values.
    };
// Study: End this group of steps.
};
