// Study: Populate the database with baseline records used by the CRM.
// Study: Import `{ PrismaClient, Module, Action }` from `"@prisma/client"`.
import { PrismaClient, Module, Action } from "@prisma/client";
// Study: Import `bcrypt` from `"bcrypt"`.
import bcrypt from "bcrypt";
// Study: Import `dotenv` from `"dotenv"`.
import dotenv from "dotenv";

// Study: Call `dotenv.config`.
dotenv.config();

// Study: Create an instance of `PrismaClient` and store the result as `prisma`.
const prisma = new PrismaClient();

// Study: Define the `main` function, which returns a promise.
async function main() {
    // Study: Call `console.log`.
    console.log("🌱 Starting database seed...");

    //////////////////////////////////////////////////
    // SEED PERMISSIONS
    //////////////////////////////////////////////////

    // Study: Build the array `permissions` with the entries below.
    const permissions = [
        // PROJECT
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.PROJECT`.
            module: Module.PROJECT,
            // Study: Set `action` to `Action.CREATE`.
            action: Action.CREATE,
            // Study: Set `description` to `"Create projects"`.
            description: "Create projects",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.PROJECT`.
            module: Module.PROJECT,
            // Study: Set `action` to `Action.VIEW`.
            action: Action.VIEW,
            // Study: Set `description` to `"View projects"`.
            description: "View projects",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.PROJECT`.
            module: Module.PROJECT,
            // Study: Set `action` to `Action.UPDATE`.
            action: Action.UPDATE,
            // Study: Set `description` to `"Update projects"`.
            description: "Update projects",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.PROJECT`.
            module: Module.PROJECT,
            // Study: Set `action` to `Action.DELETE`.
            action: Action.DELETE,
            // Study: Set `description` to `"Delete projects"`.
            description: "Delete projects",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.PROJECT`.
            module: Module.PROJECT,
            // Study: Set `action` to `Action.APPROVE`.
            action: Action.APPROVE,
            // Study: Set `description` to `"Approve projects"`.
            description: "Approve projects",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.PROJECT`.
            module: Module.PROJECT,
            // Study: Set `action` to `Action.EXPORT`.
            action: Action.EXPORT,
            // Study: Set `description` to `"Export project data"`.
            description: "Export project data",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.PROJECT`.
            module: Module.PROJECT,
            // Study: Set `action` to `Action.ASSIGN`.
            action: Action.ASSIGN,
            // Study: Set `description` to `"Assign users and labour to projects"`.
            description: "Assign users and labour to projects",
        // Study: Close the object literal.
        },

        // LABOUR
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.LABOUR`.
            module: Module.LABOUR,
            // Study: Set `action` to `Action.CREATE`.
            action: Action.CREATE,
            // Study: Set `description` to `"Create labour records"`.
            description: "Create labour records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.LABOUR`.
            module: Module.LABOUR,
            // Study: Set `action` to `Action.VIEW`.
            action: Action.VIEW,
            // Study: Set `description` to `"View labour records"`.
            description: "View labour records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.LABOUR`.
            module: Module.LABOUR,
            // Study: Set `action` to `Action.UPDATE`.
            action: Action.UPDATE,
            // Study: Set `description` to `"Update labour records"`.
            description: "Update labour records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.LABOUR`.
            module: Module.LABOUR,
            // Study: Set `action` to `Action.DELETE`.
            action: Action.DELETE,
            // Study: Set `description` to `"Delete labour records"`.
            description: "Delete labour records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.LABOUR`.
            module: Module.LABOUR,
            // Study: Set `action` to `Action.ASSIGN`.
            action: Action.ASSIGN,
            // Study: Set `description` to `"Assign labour to projects"`.
            description: "Assign labour to projects",
        // Study: Close the object literal.
        },

        // COMPANY
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.COMPANY`.
            module: Module.COMPANY,
            // Study: Set `action` to `Action.CREATE`.
            action: Action.CREATE,
            // Study: Set `description` to `"Create company records"`.
            description: "Create company records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.COMPANY`.
            module: Module.COMPANY,
            // Study: Set `action` to `Action.VIEW`.
            action: Action.VIEW,
            // Study: Set `description` to `"View company records"`.
            description: "View company records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.COMPANY`.
            module: Module.COMPANY,
            // Study: Set `action` to `Action.UPDATE`.
            action: Action.UPDATE,
            // Study: Set `description` to `"Update company records"`.
            description: "Update company records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.COMPANY`.
            module: Module.COMPANY,
            // Study: Set `action` to `Action.DELETE`.
            action: Action.DELETE,
            // Study: Set `description` to `"Delete company records"`.
            description: "Delete company records",
        // Study: Close the object literal.
        },

        // CUSTOMER
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.CUSTOMER`.
            module: Module.CUSTOMER,
            // Study: Set `action` to `Action.CREATE`.
            action: Action.CREATE,
            // Study: Set `description` to `"Create customers"`.
            description: "Create customers",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.CUSTOMER`.
            module: Module.CUSTOMER,
            // Study: Set `action` to `Action.VIEW`.
            action: Action.VIEW,
            // Study: Set `description` to `"View customers"`.
            description: "View customers",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.CUSTOMER`.
            module: Module.CUSTOMER,
            // Study: Set `action` to `Action.UPDATE`.
            action: Action.UPDATE,
            // Study: Set `description` to `"Update customers"`.
            description: "Update customers",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.CUSTOMER`.
            module: Module.CUSTOMER,
            // Study: Set `action` to `Action.DELETE`.
            action: Action.DELETE,
            // Study: Set `description` to `"Delete customers"`.
            description: "Delete customers",
        // Study: Close the object literal.
        },

        // ATTENDANCE
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.ATTENDANCE`.
            module: Module.ATTENDANCE,
            // Study: Set `action` to `Action.CREATE`.
            action: Action.CREATE,
            // Study: Set `description` to `"Create attendance records"`.
            description: "Create attendance records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.ATTENDANCE`.
            module: Module.ATTENDANCE,
            // Study: Set `action` to `Action.VIEW`.
            action: Action.VIEW,
            // Study: Set `description` to `"View attendance records"`.
            description: "View attendance records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.ATTENDANCE`.
            module: Module.ATTENDANCE,
            // Study: Set `action` to `Action.UPDATE`.
            action: Action.UPDATE,
            // Study: Set `description` to `"Update attendance records"`.
            description: "Update attendance records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.ATTENDANCE`.
            module: Module.ATTENDANCE,
            // Study: Set `action` to `Action.DELETE`.
            action: Action.DELETE,
            // Study: Set `description` to `"Delete attendance records"`.
            description: "Delete attendance records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.ATTENDANCE`.
            module: Module.ATTENDANCE,
            // Study: Set `action` to `Action.APPROVE`.
            action: Action.APPROVE,
            // Study: Set `description` to `"Approve attendance records"`.
            description: "Approve attendance records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.ATTENDANCE`.
            module: Module.ATTENDANCE,
            // Study: Set `action` to `Action.EXPORT`.
            action: Action.EXPORT,
            // Study: Set `description` to `"Export attendance records"`.
            description: "Export attendance records",
        // Study: Close the object literal.
        },

        // PAYROLL
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.PAYROLL`.
            module: Module.PAYROLL,
            // Study: Set `action` to `Action.CREATE`.
            action: Action.CREATE,
            // Study: Set `description` to `"Create payroll records"`.
            description: "Create payroll records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.PAYROLL`.
            module: Module.PAYROLL,
            // Study: Set `action` to `Action.VIEW`.
            action: Action.VIEW,
            // Study: Set `description` to `"View payroll records"`.
            description: "View payroll records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.PAYROLL`.
            module: Module.PAYROLL,
            // Study: Set `action` to `Action.UPDATE`.
            action: Action.UPDATE,
            // Study: Set `description` to `"Update payroll records"`.
            description: "Update payroll records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.PAYROLL`.
            module: Module.PAYROLL,
            // Study: Set `action` to `Action.DELETE`.
            action: Action.DELETE,
            // Study: Set `description` to `"Delete payroll records"`.
            description: "Delete payroll records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.PAYROLL`.
            module: Module.PAYROLL,
            // Study: Set `action` to `Action.APPROVE`.
            action: Action.APPROVE,
            // Study: Set `description` to `"Approve payroll"`.
            description: "Approve payroll",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.PAYROLL`.
            module: Module.PAYROLL,
            // Study: Set `action` to `Action.EXPORT`.
            action: Action.EXPORT,
            // Study: Set `description` to `"Export payroll data"`.
            description: "Export payroll data",
        // Study: Close the object literal.
        },

        // INVENTORY
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.INVENTORY`.
            module: Module.INVENTORY,
            // Study: Set `action` to `Action.CREATE`.
            action: Action.CREATE,
            // Study: Set `description` to `"Create inventory records"`.
            description: "Create inventory records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.INVENTORY`.
            module: Module.INVENTORY,
            // Study: Set `action` to `Action.VIEW`.
            action: Action.VIEW,
            // Study: Set `description` to `"View inventory"`.
            description: "View inventory",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.INVENTORY`.
            module: Module.INVENTORY,
            // Study: Set `action` to `Action.UPDATE`.
            action: Action.UPDATE,
            // Study: Set `description` to `"Update inventory"`.
            description: "Update inventory",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.INVENTORY`.
            module: Module.INVENTORY,
            // Study: Set `action` to `Action.APPROVE`.
            action: Action.APPROVE,
            // Study: Set `description` to `"Approve or reject inventory requests and returns"`.
            description: "Approve or reject inventory requests and returns",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.INVENTORY`.
            module: Module.INVENTORY,
            // Study: Set `action` to `Action.DELETE`.
            action: Action.DELETE,
            // Study: Set `description` to `"Delete inventory"`.
            description: "Delete inventory",
        // Study: Close the object literal.
        },
        // REPORT
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.REPORT`.
            module: Module.REPORT,
            // Study: Set `action` to `Action.VIEW`.
            action: Action.VIEW,
            // Study: Set `description` to `"View reports"`.
            description: "View reports",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.REPORT`.
            module: Module.REPORT,
            // Study: Set `action` to `Action.EXPORT`.
            action: Action.EXPORT,
            // Study: Set `description` to `"Export reports"`.
            description: "Export reports",
        // Study: Close the object literal.
        },

        // ROLE
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.ROLE`.
            module: Module.ROLE,
            // Study: Set `action` to `Action.CREATE`.
            action: Action.CREATE,
            // Study: Set `description` to `"Create organization roles"`.
            description: "Create organization roles",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.ROLE`.
            module: Module.ROLE,
            // Study: Set `action` to `Action.VIEW`.
            action: Action.VIEW,
            // Study: Set `description` to `"View organization roles"`.
            description: "View organization roles",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.ROLE`.
            module: Module.ROLE,
            // Study: Set `action` to `Action.UPDATE`.
            action: Action.UPDATE,
            // Study: Set `description` to `"Update organization roles"`.
            description: "Update organization roles",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.ROLE`.
            module: Module.ROLE,
            // Study: Set `action` to `Action.DELETE`.
            action: Action.DELETE,
            // Study: Set `description` to `"Delete organization roles"`.
            description: "Delete organization roles",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.ROLE`.
            module: Module.ROLE,
            // Study: Set `action` to `Action.ASSIGN`.
            action: Action.ASSIGN,
            // Study: Set `description` to `"Assign permissions to roles"`.
            description: "Assign permissions to roles",
        // Study: Close the object literal.
        },

        // USER
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.USER`.
            module: Module.USER,
            // Study: Set `action` to `Action.CREATE`.
            action: Action.CREATE,
            // Study: Set `description` to `"Create organization users"`.
            description: "Create organization users",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.USER`.
            module: Module.USER,
            // Study: Set `action` to `Action.VIEW`.
            action: Action.VIEW,
            // Study: Set `description` to `"View organization users"`.
            description: "View organization users",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.USER`.
            module: Module.USER,
            // Study: Set `action` to `Action.UPDATE`.
            action: Action.UPDATE,
            // Study: Set `description` to `"Update organization users"`.
            description: "Update organization users",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.USER`.
            module: Module.USER,
            // Study: Set `action` to `Action.DELETE`.
            action: Action.DELETE,
            // Study: Set `description` to `"Delete organization users"`.
            description: "Delete organization users",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.USER`.
            module: Module.USER,
            // Study: Set `action` to `Action.ASSIGN`.
            action: Action.ASSIGN,
            // Study: Set `description` to `"Assign roles to users"`.
            description: "Assign roles to users",
        // Study: Close the object literal.
        },

        // CONTRACTOR
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.CONTRACTOR`.
            module: Module.CONTRACTOR,
            // Study: Set `action` to `Action.CREATE`.
            action: Action.CREATE,
            // Study: Set `description` to `"Create contractor records"`.
            description: "Create contractor records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.CONTRACTOR`.
            module: Module.CONTRACTOR,
            // Study: Set `action` to `Action.VIEW`.
            action: Action.VIEW,
            // Study: Set `description` to `"View contractor records"`.
            description: "View contractor records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.CONTRACTOR`.
            module: Module.CONTRACTOR,
            // Study: Set `action` to `Action.UPDATE`.
            action: Action.UPDATE,
            // Study: Set `description` to `"Update contractor records"`.
            description: "Update contractor records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.CONTRACTOR`.
            module: Module.CONTRACTOR,
            // Study: Set `action` to `Action.DELETE`.
            action: Action.DELETE,
            // Study: Set `description` to `"Delete contractor records"`.
            description: "Delete contractor records",
        // Study: Close the object literal.
        },
        // Study: Start the object passed to the surrounding expression.
        {
            // Study: Set `module` to `Module.CONTRACTOR`.
            module: Module.CONTRACTOR,
            // Study: Set `action` to `Action.ASSIGN`.
            action: Action.ASSIGN,
            // Study: Set `description` to `"Assign contractors to projects"`.
            description: "Assign contractors to projects",
        // Study: Close the object literal.
        },
    // Study: Close the array literal.
    ];

    // Study: Iterate over each item from `permissions` using `const permission`.
    for (const permission of permissions) {
        // Study: Update the matching record or create it if it is missing through `prisma.permission` and wait for it to finish.
        await prisma.permission.upsert({
            // Study: Set the conditions that database records must match using module_action.
            where: {
                // Study: Start the nested value for `module_action`.
                module_action: {
                    // Study: Set `module` to `permission.module`.
                    module: permission.module,
                    // Study: Set `action` to `permission.action`.
                    action: permission.action,
                // Study: Close the object literal.
                },
            // Study: Close the object literal.
            },
            // Study: Start the nested value for `update`.
            update: {
                // Study: Set `description` to `permission.description`.
                description: permission.description,
            // Study: Close the object literal.
            },
            // Study: Set `create` to `permission`.
            create: permission,
        // Study: Close the object literal.
        });
    // Study: Close the code block.
    }

    // Study: Call `console.log`.
    console.log("✅ Permissions Seeded");

//////////////////////////////////////////////////
// GLOBAL ROLES
//////////////////////////////////////////////////

// Study: Set `orgOwnerRoleName` to `"ORGANIZATION_OWNER"`.
const orgOwnerRoleName = "ORGANIZATION_OWNER";
// Study: Fetch the first record that matches the filters through `prisma.role` and wait for it to finish and store its result in `existingOrgOwnerRole`.
const existingOrgOwnerRole = await prisma.role.findFirst({
    // Study: Set the conditions that database records must match using name, organizationId.
    where: {
        // Study: Set `name` to `orgOwnerRoleName`.
        name: orgOwnerRoleName,
        // Study: Set the organization identifier used for this record or operation using `null`.
        organizationId: null,
    // Study: Close the object literal.
    },
// Study: Close the object literal.
});

// Study: Run the following branch when `!existingOrgOwnerRole` is truthy.
if (!existingOrgOwnerRole) {
    // Study: Insert a new record through `prisma.role` and wait for it to finish.
    await prisma.role.create({
        // Study: Supply the values to write to the database.
        data: {
            // Study: Set `name` to `orgOwnerRoleName`.
            name: orgOwnerRoleName,
            // Study: Set `description` to `"Default organization owner role"`.
            description: "Default organization owner role",
            // Study: Set `isGlobal` to `true`.
            isGlobal: true,
            // Study: Set the organization identifier used for this record or operation using `null`.
            organizationId: null,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
    // Study: Call `console.log`.
    console.log("✅ ORGANIZATION_OWNER Role Created");
// Study: Run this branch if the preceding conditions failed.
} else {
    // Study: Update the uniquely identified record through `prisma.role` and wait for it to finish.
    await prisma.role.update({
        // Study: Set the conditions that database records must match using id.
        where: {
            // Study: Set `id` to `existingOrgOwnerRole.id`.
            id: existingOrgOwnerRole.id,
        // Study: Close the object literal.
        },
        // Study: Supply the values to write to the database.
        data: {
            // Study: Set `description` to `"Default organization owner role"`.
            description: "Default organization owner role",
            // Study: Set `isGlobal` to `true`.
            isGlobal: true,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });
    // Study: Call `console.log`.
    console.log("✅ ORGANIZATION_OWNER Role Updated");
// Study: Close the code block.
}

//////////////////////////////////////////////////
// SUPER ADMIN USER
//////////////////////////////////////////////////

// Study: Set `superAdminEmail` to `process.env.SUPER_ADMIN_EMAIL`.
const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
// Study: Set `superAdminPassword` to `process.env.SUPER_ADMIN_PASSWORD`.
const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
// Study: Set `superAdminName` to `process.env.SUPER_ADMIN_NAME`.
const superAdminName = process.env.SUPER_ADMIN_NAME;
// Study: Set `superAdminPhone` to `process.env.SUPER_ADMIN_PHONE`.
const superAdminPhone = process.env.SUPER_ADMIN_PHONE;

// Study: Run the following branch when `!superAdminEmail || !superAdminPassword || !superAdminName` is truthy.
if (
    // Study: Evaluate `!superAdminEmail || !superAdminPassword || !superAdminName`.
    !superAdminEmail ||
    // Study: Supply `superAdminPassword` to the surrounding statement.
    !superAdminPassword ||
    // Study: Supply `superAdminName` to the surrounding statement.
    !superAdminName
// Study: Close this group and continue the enclosing expression.
) {
    // Study: Stop this execution path by throwing `new Error( "SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD and SUPER_ADMIN_NAME must be co…`.
    throw new Error(
        // Study: Supply the literal string `"SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD and SUPER_ADMIN_NAME must be configured in…` here.
        "SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD and SUPER_ADMIN_NAME must be configured in .env"
    // Study: Close the current group.
    );
// Study: Close the code block.
}

// Study: Look up a single record using a unique key through `prisma.user` and wait for it to finish and store its result in `existingAdmin`.
const existingAdmin = await prisma.user.findUnique({
    // Study: Set the conditions that database records must match using email.
    where: {
        // Study: Set `email` to `superAdminEmail`.
        email: superAdminEmail,
    // Study: Close the object literal.
    },
// Study: Close the object literal.
});

// Study: Run the following branch when `!existingAdmin` is truthy.
if (!existingAdmin) {
    // Study: Call `bcrypt.hash` and wait for it to finish and store its result in `hashedPassword`.
    const hashedPassword = await bcrypt.hash(
        // Study: Supply `superAdminPassword` to the surrounding statement.
        superAdminPassword,
        // Study: Set the bcrypt cost factor to 12 for this password hash.
        12
    // Study: Close the call arguments.
    );

    // Study: Insert a new record through `prisma.user` and wait for it to finish.
    await prisma.user.create({
        // Study: Supply the values to write to the database.
        data: {
            // Study: Set `fullName` to `superAdminName`.
            fullName: superAdminName,
            // Study: Set `email` to `superAdminEmail`.
            email: superAdminEmail,
            // Study: Set `phone` to `superAdminPhone || null`.
            phone: superAdminPhone || null,
            // Study: Set `password` to `hashedPassword`.
            password: hashedPassword,

            // Study: Set `systemRole` to `"SUPER_ADMIN"`.
            systemRole: "SUPER_ADMIN",

            // Study: Set the organization identifier used for this record or operation using `null`.
            organizationId: null,
            // Study: Set `organizationRoleId` to `null`.
            organizationRoleId: null,

            // Study: Set `emailVerified` to `true`.
            emailVerified: true,
            // Study: Set `phoneVerified` to `true`.
            phoneVerified: true,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });

    // Study: Call `console.log`.
    console.log("✅ Super Admin Created");
// Study: Run this branch if the preceding conditions failed.
} else {
    // Study: Update the uniquely identified record through `prisma.user` and wait for it to finish.
    await prisma.user.update({
        // Study: Set the conditions that database records must match using id.
        where: {
            // Study: Set `id` to `existingAdmin.id`.
            id: existingAdmin.id,
        // Study: Close the object literal.
        },
        // Study: Supply the values to write to the database.
        data: {
            // Study: Set `systemRole` to `"SUPER_ADMIN"`.
            systemRole: "SUPER_ADMIN",
            // Study: Set the organization identifier used for this record or operation using `null`.
            organizationId: null,
            // Study: Set `organizationRoleId` to `null`.
            organizationRoleId: null,
        // Study: Close the object literal.
        },
    // Study: Close the object literal.
    });

    // Study: Call `console.log`.
    console.log("✅ Super Admin Updated");
// Study: Close the code block.
}

    //////////////////////////////////////////////////
    // SEED PROFESSIONS
    //////////////////////////////////////////////////

    // Study: Build the array `professions` with the entries below.
    const professions = [
        // Study: Start the object passed to the surrounding expression.
        { name: "Mason", description: "Builds structures from individual units, often laid in and bound together by mortar." },
        // Study: Start the object passed to the surrounding expression.
        { name: "Electrician", description: "Specializes in electrical wiring of buildings, stationary machines, and related equipment." },
        // Study: Start the object passed to the surrounding expression.
        { name: "Plumber", description: "Installs and maintains systems used for potable water, sewage and drainage." },
        // Study: Start the object passed to the surrounding expression.
        { name: "Carpenter", description: "Works with timber to construct, install and maintain buildings, furniture, and other objects." },
        // Study: Start the object passed to the surrounding expression.
        { name: "Welder", description: "Fuses materials together using high heat to melt the parts together." },
        // Study: Start the object passed to the surrounding expression.
        { name: "Painter", description: "Applies paint, pigment, color or other mediums to solid surfaces." },
        // Study: Start the object passed to the surrounding expression.
        { name: "Steel Fixer", description: "Positions and secures steel reinforcing bars and mesh used in reinforced concrete." },
        // Study: Start the object passed to the surrounding expression.
        { name: "Tile Worker", description: "Applies hard tile, marble, and wood tile to walls, floors, ceilings, and roof decks." },
    // Study: Close the array literal.
    ];

    // Study: Iterate over each item from `professions` using `const prof`.
    for (const prof of professions) {
        // Study: Update the matching record or create it if it is missing through `prisma.profession` and wait for it to finish.
        await prisma.profession.upsert({
            // Study: Set the conditions that database records must match using name.
            where: {
                // Study: Set `name` to `prof.name`.
                name: prof.name,
            // Study: Close the object literal.
            },
            // Study: Start the nested value for `update`.
            update: {
                // Study: Set `description` to `prof.description`.
                description: prof.description,
                // Study: Set `isActive` to `true`.
                isActive: true,
            // Study: Close the object literal.
            },
            // Study: Start the nested value for `create`.
            create: {
                // Study: Set `name` to `prof.name`.
                name: prof.name,
                // Study: Set `description` to `prof.description`.
                description: prof.description,
                // Study: Set `isActive` to `true`.
                isActive: true,
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        });
    // Study: Close the code block.
    }

    // Study: Call `console.log`.
    console.log("✅ Professions Seeded");

    //////////////////////////////////////////////////
    // SEED RESPONSIBILITIES
    //////////////////////////////////////////////////

    // Study: Build the array `responsibilities` with the entries below.
    const responsibilities = [
        // Study: Start the object passed to the surrounding expression.
        { name: "SITE_SUPERVISION", description: "Supervising and coordinating activities at the project site." },
        // Study: Start the object passed to the surrounding expression.
        { name: "PROJECT_COORDINATION", description: "Coordinating project activities, teams, schedules, and execution." },
        // Study: Start the object passed to the surrounding expression.
        { name: "QUALITY_CONTROL", description: "Monitoring and maintaining required construction quality standards." },
        // Study: Start the object passed to the surrounding expression.
        { name: "SAFETY_MANAGEMENT", description: "Managing and monitoring health and safety requirements on the project." },
        // Study: Start the object passed to the surrounding expression.
        { name: "MATERIAL_COORDINATION", description: "Coordinating construction materials, deliveries, and material requirements." },
        // Study: Start the object passed to the surrounding expression.
        { name: "SUBCONTRACTOR_MANAGEMENT", description: "Managing and coordinating subcontractors involved in project execution." },
        // Study: Start the object passed to the surrounding expression.
        { name: "WORK_PROGRESS_TRACKING", description: "Monitoring and reporting project work progress and completion." },
        // Study: Start the object passed to the surrounding expression.
        { name: "SITE_INSPECTION", description: "Inspecting site activities and verifying compliance with project requirements." },
    // Study: Close the array literal.
    ];

    // Study: Iterate over each item from `responsibilities` using `const resp`.
    for (const resp of responsibilities) {
        // Study: Update the matching record or create it if it is missing through `prisma.responsibility` and wait for it to finish.
        await prisma.responsibility.upsert({
            // Study: Set the conditions that database records must match using name.
            where: {
                // Study: Set `name` to `resp.name`.
                name: resp.name,
            // Study: Close the object literal.
            },
            // Study: Start the nested value for `update`.
            update: {
                // Study: Set `description` to `resp.description`.
                description: resp.description,
                // Study: Set `isActive` to `true`.
                isActive: true,
            // Study: Close the object literal.
            },
            // Study: Start the nested value for `create`.
            create: {
                // Study: Set `name` to `resp.name`.
                name: resp.name,
                // Study: Set `description` to `resp.description`.
                description: resp.description,
                // Study: Set `isActive` to `true`.
                isActive: true,
            // Study: Close the object literal.
            },
        // Study: Close the object literal.
        });
    // Study: Close the code block.
    }

    // Study: Call `console.log`.
    console.log("✅ Responsibilities Seeded");

    //////////////////////////////////////////////////
    // COMPLETE
    //////////////////////////////////////////////////

    // Study: Call `console.log`.
    console.log("🎉 Database Seed Completed Successfully");
// Study: Close the code block.
}

// Study: Call `main() .catch((error) => { console.error("❌ Database Seed Failed:"); console.error(…`.
main()
    // Study: Continue the chain with `catch`.
    .catch((error) => {
        // Study: Call `console.error`.
        console.error("❌ Database Seed Failed:");
        // Study: Call `console.error`.
        console.error(error);
        // Study: Call `process.exit`.
        process.exit(1);
    // Study: Close the code block.
    })
    // Study: Continue the chain with `finally`.
    .finally(async () => {
        // Study: Call `prisma.$disconnect` and wait for it to finish.
        await prisma.$disconnect();
    // Study: Close the code block.
    });
