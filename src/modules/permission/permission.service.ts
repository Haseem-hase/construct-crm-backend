// Study: This file is about the list of actions people can be allowed to take. Applies the rules for this part of the CRM, such as what must be checked before saving a change.
// Study: Bring in `* as permissionRepository` from `"./permission.repository"` so this file can use it.
import * as permissionRepository from "./permission.repository";
// Study: Bring in `{ PermissionResponse }` from `"./permission.types"` so this file can use it.
import { PermissionResponse } from "./permission.types";

// Study: Make `getAllPermissionsService` available to other files. Its result arrives after its work finishes.
export const getAllPermissionsService = async (): Promise<PermissionResponse[]> => {
    // Study: Give `permissionRepository.getAllPermissions()` back to the code that asked for it.
    return permissionRepository.getAllPermissions();
// Study: End this group of steps.
};
