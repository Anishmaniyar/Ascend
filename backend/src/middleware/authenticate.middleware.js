import jwt from "jsonwebtoken";
import AppError from "../utils/AppError.js";
import prisma from "../db.js";
import asyncHandler from "../utils/asyncHandler.js";

export const authenticate = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Not authorized, login session token is missing", 401);
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "fallback_secret_for_local_dev",
    );

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        role: true,
        createdAt: true,
      },
    });

    if (!currentUser) {
      throw new AppError(
        "The user belonging to this token no longer exists",
        401,
      );
    }
    req.user = currentUser;
    next();
  } catch (error) {
    throw new AppError(
      "Session expired or token is invalid, please log in again",
      401,
    );
  }
});
