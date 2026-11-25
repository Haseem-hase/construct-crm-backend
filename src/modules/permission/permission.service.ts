// Study: Apply business rules and coordinate database operations for the module/action permission catalog.
// Study: Import `* as permissionRepository` from `"./permission.repository"`.
import * as permissionRepository from "./permission.repository";
// Study: Import `{ PermissionResponse }` from `"./permission.types"`.
import { PermissionResponse } from "./permission.types";

// Study: Export `getAllPermissionsService` as an async function that returns a promise.
export const getAllPermissionsService = async (): Promise<PermissionResponse[]> => {
    // Study: Return `permissionRepository.getAllPermissions()` to the caller.
    return permissionRepository.getAllPermissions();
// Study: Close the code block.
};
