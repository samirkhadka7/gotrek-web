import { z } from "zod";

export const createAdminUserDto = z
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

export type CreateAdminUserDto = z.infer<typeof createAdminUserDto>;

export const updateAdminUserDto = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().trim().email("Invalid email format").optional(),
  identification: z
    .string()
    .trim()
    .min(3, "Identification must be at least 3 characters")
    .optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128)
    .optional(),
  role: z.enum(["user", "admin"]).optional(),
});

export type UpdateAdminUserDto = z.infer<typeof updateAdminUserDto>;

export const updateProfileDto = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().trim().email("Invalid email format").optional(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileDto>;
