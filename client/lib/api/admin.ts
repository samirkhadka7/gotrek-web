import axios from "axios";
import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface AdminUser {
    id: string;
    name: string;
    email?: string;
    identification?: string;
    role: "user" | "admin";
    imageUrl?: string;
    createdAt: string;
}

const handleError = (err: unknown, fallback: string): never => {
    if (axios.isAxiosError(err)) {
        throw new Error(err.response?.data?.message || err.message || fallback);
    }
    throw new Error(err instanceof Error ? err.message : fallback);
};

// GET /api/admin/users
export const getAllUsers = async (): Promise<AdminUser[]> => {
    try {
        const response = await axiosInstance.get<{ success: boolean; data: AdminUser[] }>(API.ADMIN.USERS);
        return response.data.data;
    } catch (err) {
        handleError(err, "Failed to fetch users");
    }
};

// GET /api/admin/users/:id
export const getUserById = async (id: string): Promise<AdminUser> => {
    try {
        const response = await axiosInstance.get<{ success: boolean; data: AdminUser }>(API.ADMIN.USER(id));
        return response.data.data;
    } catch (err) {
        handleError(err, "Failed to fetch user");
    }
};

// POST /api/admin/users  — always FormData (Multer requirement)
export const createUser = async (formData: FormData): Promise<AdminUser> => {
    try {
        const response = await axiosInstance.post<{ success: boolean; data: AdminUser }>(
            API.ADMIN.USERS,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data.data;
    } catch (err) {
        handleError(err, "Failed to create user");
    }
};

// PUT /api/admin/users/:id — FormData if image included
export const updateUser = async (id: string, formData: FormData): Promise<AdminUser> => {
    try {
        const response = await axiosInstance.put<{ success: boolean; data: AdminUser }>(
            API.ADMIN.USER(id),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data.data;
    } catch (err) {
        handleError(err, "Failed to update user");
    }
};

// DELETE /api/admin/users/:id
export const deleteUser = async (id: string): Promise<void> => {
    try {
        await axiosInstance.delete(API.ADMIN.USER(id));
    } catch (err) {
        handleError(err, "Failed to delete user");
    }
};

// PUT /api/auth/:id — update own profile
export const updateProfile = async (id: string, formData: FormData): Promise<AdminUser> => {
    try {
        const response = await axiosInstance.put<{ success: boolean; data: AdminUser }>(
            API.AUTH.UPDATE_PROFILE(id),
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data.data;
    } catch (err) {
        handleError(err, "Failed to update profile");
    }
};
