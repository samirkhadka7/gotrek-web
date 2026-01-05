//Actual backend API calls
import axios from "axios";
import axiosInstance from "./axios";
import { API } from "./endpoints";

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    identification?: string;
    role?: "user" | "admin";
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface ApiAuthResponse<TData> {
    success: boolean;
    message: string;
    data: TData;
}

export const register = async (registerData: RegisterPayload) => {
    try{
        const response=await axiosInstance.post<ApiAuthResponse<{ id: string; name: string; email?: string; role: "user" | "admin" }>>(API.AUTH.REGISTER,registerData);
        return response.data;// response ko body (what return backend)
    }catch(err: unknown){
        if (axios.isAxiosError(err)) {
            throw new Error(
                err.response?.data?.message
                || err.message
                || "Registration failed"
            )
        }

        throw new Error(
            err instanceof Error ? err.message : "Registration failed"
            || "Registration failed" //fallback message
        )

    }
}

export const login = async (loginData: LoginPayload) => {
    try {
        const response = await axiosInstance.post<ApiAuthResponse<{ token: string; user: { id: string; name: string; email?: string; role: "user" | "admin" } }>>(API.AUTH.LOGIN, loginData);
        return response.data;
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            throw new Error(
                err.response?.data?.message
                || err.message
                || "Login failed"
            );
        }

        throw new Error(
            err instanceof Error ? err.message : "Login failed"
        );
    }
}