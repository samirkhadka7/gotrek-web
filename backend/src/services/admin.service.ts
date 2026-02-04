import bcrypt from "bcryptjs";

import type { CreateAdminUserDto, UpdateAdminUserDto, UpdateProfileDto } from "../dto/admin.dto";
import { userRepository } from "../repositories/user.repository";
import { AuthError } from "./auth.service";

export const adminService = {
  async getAllUsers() {
    return userRepository.findAll();
  },

  async getUserById(id: string) {
    const user = await userRepository.findById(id);
    if (!user) {
      throw new AuthError("User not found", 404);
    }
    return user;
  },

  async createUser(data: CreateAdminUserDto, imageUrl?: string) {
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
      imageUrl,
    });

    return {
      id: createdUser._id.toString(),
      name: createdUser.name,
      email: createdUser.email,
      identification: createdUser.identification,
      role: createdUser.role,
      imageUrl: createdUser.imageUrl,
      createdAt: createdUser.createdAt,
    };
  },

  async updateUser(id: string, data: UpdateAdminUserDto, imageUrl?: string) {
    const updateData: Record<string, unknown> = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    if (data.email) {
      updateData.email = data.email.toLowerCase();
    }

    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const updatedUser = await userRepository.updateById(id, updateData as Parameters<typeof userRepository.updateById>[1]);
    if (!updatedUser) {
      throw new AuthError("User not found", 404);
    }

    return updatedUser;
  },

  async deleteUser(id: string) {
    const deleted = await userRepository.deleteById(id);
    if (!deleted) {
      throw new AuthError("User not found", 404);
    }
    return { id };
  },

  async updateProfile(id: string, data: UpdateProfileDto, imageUrl?: string) {
    const updateData: Record<string, unknown> = { ...data };

    if (data.email) {
      updateData.email = data.email.toLowerCase();
    }

    if (imageUrl) {
      updateData.imageUrl = imageUrl;
    }

    const updatedUser = await userRepository.updateById(id, updateData as Parameters<typeof userRepository.updateById>[1]);
    if (!updatedUser) {
      throw new AuthError("User not found", 404);
    }

    return updatedUser;
  },
};
