// Study: This file is about the list of actions people can be allowed to take. Lists the names and kinds of information this part of the code expects.
// Study: Bring in `{ Module, Action }` from `"@prisma/client"` so this file can use it.
import { Module, Action } from "@prisma/client";

// Study: Describe which information `PermissionResponse` can contain so TypeScript can catch mistakes while checking the code.
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
