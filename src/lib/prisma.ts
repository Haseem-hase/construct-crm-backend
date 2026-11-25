// Study: Create and export the Prisma client shared by database callers.
// Study: Import `{ PrismaClient }` from `"@prisma/client"`.
import { PrismaClient } from "@prisma/client";

// Study: Create an instance of `PrismaClient` and store the result as `prisma`.
const prisma = new PrismaClient({
  // Study: Start the nested value for `log`.
  log: ["query", "warn", "error"],
// Study: Close the object literal.
});

// Study: Expose `prisma` as the default export.
export default prisma;