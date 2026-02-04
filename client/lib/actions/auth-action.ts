// server side processing

"use server";
import { register, RegisterPayload } from "../api/auth";
export const handleRegister = async (formData: RegisterPayload) => {
  try {
    //how data sent from frontend to backend api
    const res = await register(formData);
    //component return logic
    if(res.success){
        return { success: true, message: "Registration successful" };
    };
    return { success: false, message: res.message || "Registration failed" };
    } catch (err: unknown ) {
    return {
      success: false,
      message:
      err instanceof Error ? err.message : "An error occurred during registration",
    };
    }
}