// Seeds Roles, Permissions and RolePermissions from the catalog.
// Idempotent: safe to re-run. Also backfills User.roleId from the legacy
// enum for users created before the migration, then reports verification.
//
// Usage: npm run db:seed
import "dotenv/config";
import prisma from "../src/db.js";
import {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
} from "../src/modules/authorization/authorization.constants.js";

const roleIds = {};

for (const role of Object.values(ROLES)) {
  const record = await prisma.role.upsert({
    where: { name: role.name },
    update: { description: role.description },
    create: { name: role.name, description: role.description },
  });
  roleIds[role.name] = record.id;
  console.log(`role ok: ${role.name}`);
}

for (const [name, description] of Object.entries(PERMISSIONS)) {
  await prisma.permission.upsert({
    where: { name },
    update: { description },
    create: { name, description },
  });
}
console.log(`permissions ok: ${Object.keys(PERMISSIONS).length}`);

// NOTE: stale assignments are intentionally NOT deleted here. Removing a
// permission from the catalog is a deliberate revocation and should be a
// separate, reviewed migration — never a seed side effect.
for (const [roleName, permissionNames] of Object.entries(ROLE_PERMISSIONS)) {
  for (const permissionName of permissionNames) {
    const permission = await prisma.permission.findUnique({
      where: { name: permissionName },
      select: { id: true },
    });
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: roleIds[roleName],
          permissionId: permission.id,
        },
      },
      update: {},
      create: { roleId: roleIds[roleName], permissionId: permission.id },
    });
  }
  console.log(`assignments ok: ${roleName} -> ${permissionNames.length}`);
}

// Backfill: legacy enum -> roleId (pass 1 of the User migration).
for (const legacyName of Object.keys(ROLES)) {
  const result = await prisma.user.updateMany({
    where: { role: legacyName, roleId: null },
    data: { roleId: roleIds[legacyName] },
  });
  console.log(`backfill ${legacyName}: ${result.count} user(s)`);
}

// Verification.
const [roleCount, permCount, assignCount, unlinked] = await Promise.all([
  prisma.role.count(),
  prisma.permission.count(),
  prisma.rolePermission.count(),
  prisma.user.count({ where: { roleId: null } }),
]);
console.log({ roleCount, permCount, assignCount, usersWithoutRole: unlinked });

if (unlinked > 0) {
  console.error("SEED INCOMPLETE: some users still lack roleId");
  process.exitCode = 1;
}

await prisma.$disconnect();
