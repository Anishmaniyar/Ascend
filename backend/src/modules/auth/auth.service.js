import AppError from "../../utils/AppError.js";
import * as authRepository from "./auth.repository.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt.js";

export const registerUser = async (name, email, password) => {
  const ifUserExists = await authRepository.findUserByEmail(email);

  if (ifUserExists) {
    throw new AppError("User with same email already exists", 409);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = {
    name,
    email,
    password: hashedPassword,
  };

  const createUser = await authRepository.createUser(newUser);

  const accessToken = generateToken({
    id: createUser.id,
    email: createUser.email,
  });

  return {
    user: createUser,
    token: accessToken,
  };
};

export const authenticateUser = async (email, password) => {
  const userExist = await authRepository.findUserByEmail(email);

  if (!userExist) {
    throw new AppError("User not found", 404);
  }

  const isPasswordValid = bcrypt.compare(password, userExist.password);

  if (!isPasswordValid) {
    throw new AppError("Password is incorrect", 400);
  }

  const accessToken = generateToken({
    id: userExist.id,
    email: userExist.email,
  });

  return {
    user: {
      id: userExist.id,
      name: userExist.name,
      email: userExist.email,
    },
    token: accessToken,
  };
};

export const getCurrentUser = async (userId) => {
  const response = await authRepository.findUserById(userId);

  return {
    user: {
      id: userExist.id,
      name: userExist.name,
      email: userExist.email,
    },
  };
};
