import prisma from "../../db.js";

// Database access only. No allow/deny decisions here —
// those belong to authorization.service.js.

export const findRoleByName = async (name) => {
  return await prisma.role.findUnique({
    where: { name },
    select: { id: true, name: true },
  });
};

// Single query: does this role hold this permission name?
export const hasRolePermission = async (roleId, permissionName) => {
  const link = await prisma.rolePermission.findFirst({
    where: {
      roleId,
      permission: { name: permissionName },
    },
    select: { roleId: true },
  });

  return link !== null;
};
