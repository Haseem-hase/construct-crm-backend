import { Module, Action } from "@prisma/client";

export interface PermissionResponse {
    id: string;
    module: Module;
    action: Action;
    description: string | null;
}
