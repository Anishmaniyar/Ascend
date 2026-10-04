import prisma from "../../db.js";

// Authoritative lookup: provider + providerUserId (Google `sub`).
// Do NOT auto-merge on email alone; account linking is a separate decision.
export const findAuthAccountByProviderId = async (
  provider,
  providerUserId,
) => {
  return await prisma.authAccount.findUnique({
    where: {
      provider_providerUserId: { provider, providerUserId },
    },
    include: { user: true },
  });
};

export const createUser = async ({ name, email, avatar, roleId }) => {
  return await prisma.user.create({
    data: {
      name,
      email,
      avatar: avatar || undefined,
      roleId,
    },
  });
};

export const createAuthAccount = async ({ userId, provider, providerUserId }) => {
  return await prisma.authAccount.create({
    data: {
      userId,
      provider,
      providerUserId,
    },
  });
};

// Kept for future use (e.g. profile checks). Not used for auto-linking.
export const findUserByEmail = async (email) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const createAuthSession = async ({
  userId,
  refreshTokenHash,
  expiresAt,
}) => {
  return await prisma.authSession.create({
    data: {
      userId,
      refreshTokenHash,
      expiresAt,
    },
  });
};

export const findAuthSessionByTokenHash = async (refreshTokenHash) => {
  return await prisma.authSession.findUnique({
    where: { refreshTokenHash },
    include: { user: true },
  });
};

// Marks the session revoked and records last use. Old refresh tokens
// stay in the table as revoked rows (audit trail, replay detection).
export const revokeAuthSession = async (sessionId) => {
  return await prisma.authSession.update({
    where: { id: sessionId },
    data: {
      revokedAt: new Date(),
      lastUsedAt: new Date(),
    },
  });
};

export const findUserById = async (userId) => {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

// ---- Profile (Phase 3: User 1 ── 1 Profile) ----
// Find-or-create lives in the service layer; these stay thin Prisma calls.
// Existing rows are never overwritten by callers (Google must not clobber
// user-customized displayName/avatarUrl on later logins).
export const findProfileByUserId = async (userId) => {
  return await prisma.profile.findUnique({
    where: { userId },
  });
};

export const findProfileByHandle = async (handle) => {
  return await prisma.profile.findUnique({
    where: { handle },
  });
};

export const createProfile = async ({
  userId,
  displayName,
  handle,
  avatarUrl,
}) => {
  return await prisma.profile.create({
    data: {
      userId,
      displayName,
      handle: handle || undefined,
      avatarUrl: avatarUrl || undefined,
    },
  });
};
