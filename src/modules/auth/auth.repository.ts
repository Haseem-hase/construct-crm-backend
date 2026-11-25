// Study: Read and write database records through Prisma for account registration, sign-in, sign-out, and session token refresh.
// Study: Import `prisma` from `'../../lib/prisma'`.
import prisma from '../../lib/prisma';
// Study: Import `{ authenticatedUserSelect }` from `'../../shared/types/authenticated-user'`.
import { authenticatedUserSelect } from '../../shared/types/authenticated-user';
// Study: Import `{ CreateUserInput }` from `'./auth.types'`.
import { CreateUserInput } from './auth.types';

// Study: Export `findUserByEmail` as an async function that returns a promise.
export const findUserByEmail = async (email: string) => {
    // Study: Return `await prisma.user.findUnique({ where: { email, }, include: { organizationRole: { in…` to the caller.
    return await prisma.user.findUnique({
        // Study: Set the conditions that database records must match using email.
        where: {
            // Study: Pass the current `email` value under the same property name.
            email,
        // Study: Close the object literal.
        },
        // Study: Load related database records with the main result.
        include: {
            // Study: Start the nested value for `organizationRole`.
            organizationRole: {
                // Study: Load related database records with the main result.
                include: {
                    // Study: Set `role` to `true`.
                    role: true,
                // Study: Close the object literal.
                },
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findUserByPhone` as an async function that returns a promise.
export const findUserByPhone = async (phone: string) => {
    // Study: Return `await prisma.user.findUnique({ where: { phone, }, })` to the caller.
    return await prisma.user.findUnique({
        // Study: Set the conditions that database records must match using phone.
        where: {
            // Study: Pass the current `phone` value under the same property name.
            phone,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findRoleByName` as an async function that returns a promise.
export const findRoleByName = async (name: string) => {
    // Study: Return `await prisma.role.findFirst({ where: { name, isGlobal: true, }, })` to the caller.
    return await prisma.role.findFirst({
        // Study: Set the conditions that database records must match using name, isGlobal.
        where: {
            // Study: Pass the current `name` value under the same property name.
            name,
            // Study: Set `isGlobal` to `true`.
            isGlobal: true,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `createUser` as an async function that returns a promise.
export const createUser = async (
    // Study: Accept `data` with type `CreateUserInput`.
    data: CreateUserInput
// Study: Close this group and continue the enclosing expression.
) => {
    // Study: Return `await prisma.user.create({ data, })` to the caller.
    return await prisma.user.create({
        // Study: Pass the current `data` value under the same property name.
        data,
    // Study: Close the object literal.
    });
// Study: Close the code block.
};

// Study: Export `findUserById` as an async function that returns a promise.
export const findUserById = async (id: string) => {
    // Study: Return `await prisma.user.findUnique({ where: { id, }, select: authenticatedUserSelect })` to the caller.
    return await prisma.user.findUnique({
        // Study: Set the conditions that database records must match using id.
        where: {
            // Study: Pass the current `id` value under the same property name.
            id,
        // Study: Close the object literal.
        },
        // Study: Choose which fields Prisma returns using `authenticatedUserSelect`.
        select: authenticatedUserSelect
        
    // Study: Close the object literal.
    });
// Study: Close the code block.
};