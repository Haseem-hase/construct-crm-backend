// Study: This file is about signing in, signing out, creating an account, and staying signed in. Finds or saves information in the database, where the CRM keeps its records.
// Study: Bring in `prisma` from `'../../lib/prisma'` so this file can use it.
import prisma from '../../lib/prisma';
// Study: Bring in `{ authenticatedUserSelect }` from `'../../shared/types/authenticated-user'` so this file can use it.
import { authenticatedUserSelect } from '../../shared/types/authenticated-user';
// Study: Bring in `{ CreateUserInput }` from `'./auth.types'` so this file can use it.
import { CreateUserInput } from './auth.types';

// Study: Make `findUserByEmail` available to other files. Its result arrives after its work finishes.
export const findUserByEmail = async (email: string) => {
    // Study: Give `await prisma.user.findUnique({ where: { email, }, include: { organizationRole: { in…` back to the code that asked for it.
    return await prisma.user.findUnique({
        // Study: Set the conditions that records must meet using email.
        where: {
            // Study: Carry the value of `email` into the new group under the same name.
            email,
        // Study: End this group of values.
        },
        // Study: Ask for linked information along with the main record.
        include: {
            // Study: Start the nested value for `organizationRole`.
            organizationRole: {
                // Study: Ask for linked information along with the main record.
                include: {
                    // Study: Set `role` to `true`.
                    role: true,
                // Study: End this group of values.
                },
            // Study: End this group of values.
            },
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findUserByPhone` available to other files. Its result arrives after its work finishes.
export const findUserByPhone = async (phone: string) => {
    // Study: Give `await prisma.user.findUnique({ where: { phone, }, })` back to the code that asked for it.
    return await prisma.user.findUnique({
        // Study: Set the conditions that records must meet using phone.
        where: {
            // Study: Carry the value of `phone` into the new group under the same name.
            phone,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findRoleByName` available to other files. Its result arrives after its work finishes.
export const findRoleByName = async (name: string) => {
    // Study: Give `await prisma.role.findFirst({ where: { name, isGlobal: true, }, })` back to the code that asked for it.
    return await prisma.role.findFirst({
        // Study: Set the conditions that records must meet using name, isGlobal.
        where: {
            // Study: Carry the value of `name` into the new group under the same name.
            name,
            // Study: Set `isGlobal` to `true`.
            isGlobal: true,
        // Study: End this group of values.
        },
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `createUser` available to other files. Its result arrives after its work finishes.
export const createUser = async (
    // Study: This step receives `data`. `CreateUserInput` describes what that information should look like.
    data: CreateUserInput
// Study: Finish this group and continue the surrounding step.
) => {
    // Study: Give `await prisma.user.create({ data, })` back to the code that asked for it.
    return await prisma.user.create({
        // Study: Carry the value of `data` into the new group under the same name.
        data,
    // Study: End this group of values.
    });
// Study: End this group of steps.
};

// Study: Make `findUserById` available to other files. Its result arrives after its work finishes.
export const findUserById = async (id: string) => {
    // Study: Give `await prisma.user.findUnique({ where: { id, }, select: authenticatedUserSelect })` back to the code that asked for it.
    return await prisma.user.findUnique({
        // Study: Set the conditions that records must meet using id.
        where: {
            // Study: Carry the value of `id` into the new group under the same name.
            id,
        // Study: End this group of values.
        },
        // Study: Choose which details the database gives back using `authenticatedUserSelect`.
        select: authenticatedUserSelect
        
    // Study: End this group of values.
    });
// Study: End this group of steps.
};