import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Seed Roles
  const roles = [
    {
      name: "SUPER_ADMIN",
      description: "System Administrator",
    },
    {
      name: "CONTRACTOR",
      description: "Construction Company",
    },
    {
      name: "LABOUR",
      description: "Company Labour",
    },
    {
      name: "CUSTOMER",
      description: "Customer / Client",
    },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        name: role.name,
      },
      update: {},
      create: role,
    });
  }

  console.log("✅ Roles Seeded");

  const superAdminRole = await prisma.role.findUnique({
    where: {
      name: "SUPER_ADMIN",
    },
  });

  if (!superAdminRole) {
    throw new Error("SUPER_ADMIN role not found.");
  }

  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: process.env.SUPER_ADMIN_EMAIL!,
    },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(
      process.env.SUPER_ADMIN_PASSWORD!,
      12
    );

    await prisma.user.create({
      data: {
        fullName: process.env.SUPER_ADMIN_NAME!,
        email: process.env.SUPER_ADMIN_EMAIL!,
        phone: process.env.SUPER_ADMIN_PHONE!,
        password: hashedPassword,

        roleId: superAdminRole.id,

        emailVerified: true,
        phoneVerified: true,
      },
    });

    console.log("✅ Super Admin Created");
  } else {
    console.log("ℹ️ Super Admin Already Exists");
  }

  console.log("🎉 Database Seed Completed Successfully");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });