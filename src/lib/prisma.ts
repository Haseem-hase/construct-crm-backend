// Study: Creates the shared connection tool the CRM uses to find and save database records.
// Study: Bring in `{ PrismaClient }` from `"@prisma/client"` so this file can use it.
import { PrismaClient } from "@prisma/client";

// Study: Create an instance of `PrismaClient` and store the result as `prisma`.
const prisma = new PrismaClient({
  // Study: Start the nested value for `log`.
  log: ["query", "warn", "error"],
// Study: End this group of values.
});

// Study: Make `prisma` the main thing other files can get from this file.
export default prisma;