import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { hasPermission } from "../modules/authorization/authorization.service.js";

// Capability gate: requirePermission("questions:create").
// Must run AFTER authenticate() — it reads req.user, never the token.
// Role/permissions are loaded per request from the DB (via authenticate),
// so role changes take effect immediately instead of lingering in a JWT.
export const requirePermission = (permissionName) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user || !req.user.roleId) {
      throw new AppError("Authentication required", 401);
    }

    const allowed = await hasPermission(req.user.roleId, permissionName);

    if (!allowed) {
      // Structured denial log. Never log tokens.
      console.error(
        JSON.stringify({
          event: "AUTHORIZATION_DENIED",
          userId: req.user.id,
          role: req.user.role,
          permission: permissionName,
          method: req.method,
          route: req.originalUrl,
        }),
      );
      throw new AppError("Insufficient permissions", 403);
    }

    next();
  });
};
