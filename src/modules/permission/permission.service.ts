import * as permissionRepository from "./permission.repository";
import { PermissionResponse } from "./permission.types";

export const getAllPermissionsService = async (): Promise<PermissionResponse[]> => {
    return permissionRepository.getAllPermissions();
};
