const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const customers = await prisma.$queryRaw`SELECT * FROM "customers" LIMIT 5;`;
  console.log(customers);
}

main().catch(console.error).finally(() => prisma.$disconnect());
