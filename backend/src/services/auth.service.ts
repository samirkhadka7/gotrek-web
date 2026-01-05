import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import type { LoginUserDto, RegisterUserDto } from "../dto/auth.dto";
import { userRepository } from "../repositories/user.repository";

export class AuthError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "AuthError";
    this.statusCode = statusCode;
  }
}

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }
  return secret;
};

const signToken = (payload: { id: string; email?: string; role: "user" | "admin" }) => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
};

export const authService = {
  async register(data: RegisterUserDto) {
    const existingUser = await userRepository.findByEmailOrIdentification(data.email, data.identification);
    if (existingUser) {
      throw new AuthError("User with this email or identification already exists", 409);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const createdUser = await userRepository.create({
      name: data.name,
      email: data.email?.toLowerCase(),
      identification: data.identification,
      password: hashedPassword,
      role: data.role || "user",
    });

    return {
      id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      identification: createdUser.identification,
      role: createdUser.role,
      createdAt: createdUser.createdAt,
    };
  },

  async login(data: LoginUserDto) {
    const existingUser = await userRepository.findByEmail(data.email);
    if (!existingUser) {
      throw new AuthError("User with this email does not exist", 404);
    }

    const isPasswordValid = await bcrypt.compare(data.password, existingUser.password);
    if (!isPasswordValid) {
      throw new AuthError("Invalid email or password", 401);
    }

    const token = signToken({
      id: existingUser._id.toString(),
      email: existingUser.email,
      role: existingUser.role,
    });

    return {
      token,
      user: {
        id: existingUser._id.toString(),
        name: existingUser.name,
        email: existingUser.email,
        role: existingUser.role,
      },
    };
  },
};
