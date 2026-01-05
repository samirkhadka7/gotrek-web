import { Model, Schema, model, models } from "mongoose";

export type UserRole = "user" | "admin";

export interface IUser {
  name: string;
  email?: string;
  identification?: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

type UserModel = Model<IUser>;

const userSchema = new Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
    },
    identification: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = (models.User as UserModel) || model<IUser, UserModel>("User", userSchema);
