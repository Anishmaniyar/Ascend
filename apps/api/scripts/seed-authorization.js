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
import { BADGE_DEFINITIONS } from "../src/modules/badges/badge.constants.js";

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

// NOTE (2026-10-04): the legacy-enum -> roleId backfill was removed. The
// `role`/`password` columns no longer exist in the live database (dropped via
// db push when the schema moved to roleId), so referencing them crashes the
// seed. Any user without roleId now fails verification below instead.

// Badges (Phase 15): definitions are code (badge.constants.js); the seed
// only upserts them by stable `code`. Never deleted here — same revocation
// policy as permissions.
for (const badge of BADGE_DEFINITIONS) {
  await prisma.badge.upsert({
    where: { code: badge.code },
    update: {
      name: badge.name,
      description: badge.description,
      icon: badge.icon,
      category: badge.category,
    },
    create: badge,
  });
}
const badgeCount = await prisma.badge.count();
console.log(`badges ok: ${badgeCount}`);

// Backfill: Profile rows for users created before the Profile model.
// Idempotent (skips users that already have one). Never overwrites.
// Handle is derived from the email prefix with a numeric suffix on collision.
let profilesBackfilled = 0;
const usersWithoutProfile = await prisma.user.findMany({
  where: { profile: null },
  select: { id: true, name: true, email: true, avatar: true },
});
const buildHandleBase = (email, name) =>
  (
    email?.split("@")[0] ||
    name ||
    "user"
  )
    .toLowerCase()
    .replace(/[^a-z0-9_]/g, "_")
    .slice(0, 20) || "user";
for (const u of usersWithoutProfile) {
  let candidate = buildHandleBase(u.email, u.name);
  for (let attempt = 0; attempt < 10; attempt++) {
    const taken = await prisma.profile.findUnique({
      where: { handle: candidate },
    });
    if (!taken || taken.userId === u.id) break;
    candidate = `${buildHandleBase(u.email, u.name)}${attempt + 1}`.slice(0, 50);
  }
  await prisma.profile.upsert({
    where: { userId: u.id },
    update: {},
    create: {
      userId: u.id,
      displayName: u.name,
      avatarUrl: u.avatar || undefined,
      handle: candidate,
    },
  });
  profilesBackfilled++;
}
console.log(`profiles backfilled: ${profilesBackfilled} user(s)`);

// Verification. roleId is required in the live schema, so "unlinked" now
// means a roleId pointing at no Role row (should be impossible).
const [roleCount, permCount, assignCount, userCount, missingProfiles] =
  await Promise.all([
    prisma.role.count(),
    prisma.permission.count(),
    prisma.rolePermission.count(),
    prisma.user.count(),
    prisma.user.count({ where: { profile: null } }),
  ]);
console.log({
  roleCount,
  permCount,
  assignCount,
  userCount,
  usersWithoutProfile: missingProfiles,
});

if (missingProfiles > 0) {
  console.error("SEED INCOMPLETE: some users still lack a Profile row");
  process.exitCode = 1;
}

await prisma.$disconnect();
