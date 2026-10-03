import AppError from "../utils/AppError.js";
import prisma from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../modules/auth/token.service.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.access_token) {
    token = req.cookies.access_token;
  }

  if (!token) {
    throw new AppError("Not authorized, login session token is missing", 401);
  }

  // Throws 401 on expired/invalid token. No fallback secrets.
  const decoded = verifyAccessToken(token);

  // Role is loaded per request (not embedded in the JWT) so role changes
  // take effect immediately. `role` carries the role NAME for denial logs.
  const currentUser = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: {
      id: true,
      email: true,
      name: true,
      avatar: true,
      bio: true,
      roleId: true,
      roleRef: {
        select: { name: true },
      },
      createdAt: true,
    },
  });

  if (!currentUser) {
    throw new AppError(
      "The user belonging to this token no longer exists",
      401,
    );
  }

  if (!currentUser.roleRef) {
    throw new AppError("User has no role assigned", 403);
  }

  req.user = {
    id: currentUser.id,
    email: currentUser.email,
    name: currentUser.name,
    avatar: currentUser.avatar,
    bio: currentUser.bio,
    roleId: currentUser.roleId,
    role: currentUser.roleRef.name,
    createdAt: currentUser.createdAt,
  };
  next();
});
