import { z } from "zod";

export const registerUserDto = z
  .object({
    name: z.string().trim().min(2, "Name must be at least 2 characters"),
    email: z.string().trim().email("Invalid email format").optional(),
    identification: z
      .string()
      .trim()
      .min(3, "Identification must be at least 3 characters")
      .optional(),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password cannot exceed 128 characters"),
    role: z.enum(["user", "admin"]).optional(),
  })
  .refine((payload) => !!payload.email || !!payload.identification, {
    message: "Either email or identification is required",
    path: ["email"],
  });

export type RegisterUserDto = z.infer<typeof registerUserDto>;

export const loginUserDto = z.object({
  email: z.string().trim().email("Invalid email format"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters"),
});

export type LoginUserDto = z.infer<typeof loginUserDto>;
