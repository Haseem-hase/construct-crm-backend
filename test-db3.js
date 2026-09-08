const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const customers = await prisma.$queryRaw`SELECT id, name, "customerCode", "parentCustomerId" FROM "customers" WHERE "parentCustomerId" IS NOT NULL;`;
  console.log(customers);
}

main().catch(console.error).finally(() => prisma.$disconnect());
