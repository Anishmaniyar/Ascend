import AppError from "../../utils/AppError.js";
import * as permissionRepository from "./permission.repository.js";
import { isKnownPermission } from "./authorization.constants.js";

// Answers one question: roleId + permission -> allowed / denied.
// Unknown permission names fail CLOSED (500): that is a programmer error
// in a route definition, and silently denying would hide it.
export const hasPermission = async (roleId, permissionName) => {
  if (!isKnownPermission(permissionName)) {
    throw new AppError(
      `Unknown permission "${permissionName}" — check authorization.constants.js`,
      500,
    );
  }

  if (!roleId) {
    return false;
  }

  return await permissionRepository.hasRolePermission(roleId, permissionName);
};
