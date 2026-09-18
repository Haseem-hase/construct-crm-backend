import { PrismaClient, Module, Action } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting database seed...");

    //////////////////////////////////////////////////
    // SEED PERMISSIONS
    //////////////////////////////////////////////////

    const permissions = [
        // PROJECT
        {
            module: Module.PROJECT,
            action: Action.CREATE,
            description: "Create projects",
        },
        {
            module: Module.PROJECT,
            action: Action.VIEW,
            description: "View projects",
        },
        {
            module: Module.PROJECT,
            action: Action.UPDATE,
            description: "Update projects",
        },
        {
            module: Module.PROJECT,
            action: Action.DELETE,
            description: "Delete projects",
        },
        {
            module: Module.PROJECT,
            action: Action.APPROVE,
            description: "Approve projects",
        },
        {
            module: Module.PROJECT,
            action: Action.EXPORT,
            description: "Export project data",
        },
        {
            module: Module.PROJECT,
            action: Action.ASSIGN,
            description: "Assign users and labour to projects",
        },

        // LABOUR
        {
            module: Module.LABOUR,
            action: Action.CREATE,
            description: "Create labour records",
        },
        {
            module: Module.LABOUR,
            action: Action.VIEW,
            description: "View labour records",
        },
        {
            module: Module.LABOUR,
            action: Action.UPDATE,
            description: "Update labour records",
        },
        {
            module: Module.LABOUR,
            action: Action.DELETE,
            description: "Delete labour records",
        },
        {
            module: Module.LABOUR,
            action: Action.ASSIGN,
            description: "Assign labour to projects",
        },

        // COMPANY
        {
            module: Module.COMPANY,
            action: Action.CREATE,
            description: "Create company records",
        },
        {
            module: Module.COMPANY,
            action: Action.VIEW,
            description: "View company records",
        },
        {
            module: Module.COMPANY,
            action: Action.UPDATE,
            description: "Update company records",
        },
        {
            module: Module.COMPANY,
            action: Action.DELETE,
            description: "Delete company records",
        },

        // CUSTOMER
        {
            module: Module.CUSTOMER,
            action: Action.CREATE,
            description: "Create customers",
        },
        {
            module: Module.CUSTOMER,
            action: Action.VIEW,
            description: "View customers",
        },
        {
            module: Module.CUSTOMER,
            action: Action.UPDATE,
            description: "Update customers",
        },
        {
            module: Module.CUSTOMER,
            action: Action.DELETE,
            description: "Delete customers",
        },

        // ATTENDANCE
        {
            module: Module.ATTENDANCE,
            action: Action.CREATE,
            description: "Create attendance records",
        },
        {
            module: Module.ATTENDANCE,
            action: Action.VIEW,
            description: "View attendance records",
        },
        {
            module: Module.ATTENDANCE,
            action: Action.UPDATE,
            description: "Update attendance records",
        },
        {
            module: Module.ATTENDANCE,
            action: Action.DELETE,
            description: "Delete attendance records",
        },
        {
            module: Module.ATTENDANCE,
            action: Action.APPROVE,
            description: "Approve attendance records",
        },
        {
            module: Module.ATTENDANCE,
            action: Action.EXPORT,
            description: "Export attendance records",
        },

        // PAYROLL
        {
            module: Module.PAYROLL,
            action: Action.CREATE,
            description: "Create payroll records",
        },
        {
            module: Module.PAYROLL,
            action: Action.VIEW,
            description: "View payroll records",
        },
        {
            module: Module.PAYROLL,
            action: Action.UPDATE,
            description: "Update payroll records",
        },
        {
            module: Module.PAYROLL,
            action: Action.DELETE,
            description: "Delete payroll records",
        },
        {
            module: Module.PAYROLL,
            action: Action.APPROVE,
            description: "Approve payroll",
        },
        {
            module: Module.PAYROLL,
            action: Action.EXPORT,
            description: "Export payroll data",
        },

        // INVENTORY
        {
            module: Module.INVENTORY,
            action: Action.CREATE,
            description: "Create inventory records",
        },
        {
            module: Module.INVENTORY,
            action: Action.VIEW,
            description: "View inventory",
        },
        {
            module: Module.INVENTORY,
            action: Action.UPDATE,
            description: "Update inventory",
        },
        {
            module: Module.INVENTORY,
            action: Action.DELETE,
            description: "Delete inventory",
        },
        {
            module: Module.INVENTORY,
            action: Action.EXPORT,
            description: "Export inventory data",
        },

        // SUPPLIER
        {
            module: Module.SUPPLIER,
            action: Action.CREATE,
            description: "Create suppliers",
        },
        {
            module: Module.SUPPLIER,
            action: Action.VIEW,
            description: "View suppliers",
        },
        {
            module: Module.SUPPLIER,
            action: Action.UPDATE,
            description: "Update suppliers",
        },
        {
            module: Module.SUPPLIER,
            action: Action.DELETE,
            description: "Delete suppliers",
        },

        // REPORT
        {
            module: Module.REPORT,
            action: Action.VIEW,
            description: "View reports",
        },
        {
            module: Module.REPORT,
            action: Action.EXPORT,
            description: "Export reports",
        },

        // ROLE
        {
            module: Module.ROLE,
            action: Action.CREATE,
            description: "Create organization roles",
        },
        {
            module: Module.ROLE,
            action: Action.VIEW,
            description: "View organization roles",
        },
        {
            module: Module.ROLE,
            action: Action.UPDATE,
            description: "Update organization roles",
        },
        {
            module: Module.ROLE,
            action: Action.DELETE,
            description: "Delete organization roles",
        },
        {
            module: Module.ROLE,
            action: Action.ASSIGN,
            description: "Assign permissions to roles",
        },

        // USER
        {
            module: Module.USER,
            action: Action.CREATE,
            description: "Create organization users",
        },
        {
            module: Module.USER,
            action: Action.VIEW,
            description: "View organization users",
        },
        {
            module: Module.USER,
            action: Action.UPDATE,
            description: "Update organization users",
        },
        {
            module: Module.USER,
            action: Action.DELETE,
            description: "Delete organization users",
        },
        {
            module: Module.USER,
            action: Action.ASSIGN,
            description: "Assign roles to users",
        },

        // CONTRACTOR
        {
            module: Module.CONTRACTOR,
            action: Action.CREATE,
            description: "Create contractor records",
        },
        {
            module: Module.CONTRACTOR,
            action: Action.VIEW,
            description: "View contractor records",
        },
        {
            module: Module.CONTRACTOR,
            action: Action.UPDATE,
            description: "Update contractor records",
        },
        {
            module: Module.CONTRACTOR,
            action: Action.DELETE,
            description: "Delete contractor records",
        },
    ];

    for (const permission of permissions) {
        await prisma.permission.upsert({
            where: {
                module_action: {
                    module: permission.module,
                    action: permission.action,
                },
            },
            update: {
                description: permission.description,
            },
            create: permission,
        });
    }

    console.log("✅ Permissions Seeded");

//////////////////////////////////////////////////
// GLOBAL ROLES
//////////////////////////////////////////////////

const orgOwnerRoleName = "ORGANIZATION_OWNER";
const existingOrgOwnerRole = await prisma.role.findFirst({
    where: {
        name: orgOwnerRoleName,
        organizationId: null,
    },
});

if (!existingOrgOwnerRole) {
    await prisma.role.create({
        data: {
            name: orgOwnerRoleName,
            description: "Default organization owner role",
            isGlobal: true,
            organizationId: null,
        },
    });
    console.log("✅ ORGANIZATION_OWNER Role Created");
} else {
    await prisma.role.update({
        where: {
            id: existingOrgOwnerRole.id,
        },
        data: {
            description: "Default organization owner role",
            isGlobal: true,
        },
    });
    console.log("✅ ORGANIZATION_OWNER Role Updated");
}

//////////////////////////////////////////////////
// SUPER ADMIN USER
//////////////////////////////////////////////////

const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
const superAdminPassword = process.env.SUPER_ADMIN_PASSWORD;
const superAdminName = process.env.SUPER_ADMIN_NAME;
const superAdminPhone = process.env.SUPER_ADMIN_PHONE;

if (
    !superAdminEmail ||
    !superAdminPassword ||
    !superAdminName
) {
    throw new Error(
        "SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD and SUPER_ADMIN_NAME must be configured in .env"
    );
}

const existingAdmin = await prisma.user.findUnique({
    where: {
        email: superAdminEmail,
    },
});

if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(
        superAdminPassword,
        12
    );

    await prisma.user.create({
        data: {
            fullName: superAdminName,
            email: superAdminEmail,
            phone: superAdminPhone || null,
            password: hashedPassword,

            systemRole: "SUPER_ADMIN",

            organizationId: null,
            organizationRoleId: null,

            emailVerified: true,
            phoneVerified: true,
        },
    });

    console.log("✅ Super Admin Created");
} else {
    await prisma.user.update({
        where: {
            id: existingAdmin.id,
        },
        data: {
            systemRole: "SUPER_ADMIN",
            organizationId: null,
            organizationRoleId: null,
        },
    });

    console.log("✅ Super Admin Updated");
}

    //////////////////////////////////////////////////
    // SEED PROFESSIONS
    //////////////////////////////////////////////////

    const professions = [
        { name: "Mason", description: "Builds structures from individual units, often laid in and bound together by mortar." },
        { name: "Electrician", description: "Specializes in electrical wiring of buildings, stationary machines, and related equipment." },
        { name: "Plumber", description: "Installs and maintains systems used for potable water, sewage and drainage." },
        { name: "Carpenter", description: "Works with timber to construct, install and maintain buildings, furniture, and other objects." },
        { name: "Welder", description: "Fuses materials together using high heat to melt the parts together." },
        { name: "Painter", description: "Applies paint, pigment, color or other mediums to solid surfaces." },
        { name: "Steel Fixer", description: "Positions and secures steel reinforcing bars and mesh used in reinforced concrete." },
        { name: "Tile Worker", description: "Applies hard tile, marble, and wood tile to walls, floors, ceilings, and roof decks." },
    ];

    for (const prof of professions) {
        await prisma.profession.upsert({
            where: {
                name: prof.name,
            },
            update: {
                description: prof.description,
                isActive: true,
            },
            create: {
                name: prof.name,
                description: prof.description,
                isActive: true,
            },
        });
    }

    console.log("✅ Professions Seeded");

    //////////////////////////////////////////////////
    // SEED RESPONSIBILITIES
    //////////////////////////////////////////////////

    const responsibilities = [
        { name: "SITE_SUPERVISION", description: "Supervising and coordinating activities at the project site." },
        { name: "PROJECT_COORDINATION", description: "Coordinating project activities, teams, schedules, and execution." },
        { name: "QUALITY_CONTROL", description: "Monitoring and maintaining required construction quality standards." },
        { name: "SAFETY_MANAGEMENT", description: "Managing and monitoring health and safety requirements on the project." },
        { name: "MATERIAL_COORDINATION", description: "Coordinating construction materials, deliveries, and material requirements." },
        { name: "SUBCONTRACTOR_MANAGEMENT", description: "Managing and coordinating subcontractors involved in project execution." },
        { name: "WORK_PROGRESS_TRACKING", description: "Monitoring and reporting project work progress and completion." },
        { name: "SITE_INSPECTION", description: "Inspecting site activities and verifying compliance with project requirements." },
    ];

    for (const resp of responsibilities) {
        await prisma.responsibility.upsert({
            where: {
                name: resp.name,
            },
            update: {
                description: resp.description,
                isActive: true,
            },
            create: {
                name: resp.name,
                description: resp.description,
                isActive: true,
            },
        });
    }

    console.log("✅ Responsibilities Seeded");

    //////////////////////////////////////////////////
    // COMPLETE
    //////////////////////////////////////////////////

    console.log("🎉 Database Seed Completed Successfully");
}

main()
    .catch((error) => {
        console.error("❌ Database Seed Failed:");
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });