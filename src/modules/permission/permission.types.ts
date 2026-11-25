// Study: Define TypeScript data contracts for the module/action permission catalog.
// Study: Import `{ Module, Action }` from `"@prisma/client"`.
import { Module, Action } from "@prisma/client";

// Study: Define the compile-time contract named `PermissionResponse`.
export interface PermissionResponse {
    // Study: Define `id` with type `string`.
    id: string;
    // Study: Define `module` with type `Module`.
    module: Module;
    // Study: Define `action` with type `Action`.
    action: Action;
    // Study: Define `description` with type `string | null`.
    description: string | null;
// Study: Close the interface declaration.
}
