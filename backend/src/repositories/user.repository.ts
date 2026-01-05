import { IUser, User } from "../models/user.model";

export const userRepository = {
  findByEmail(email: string) {
    return User.findOne({ email: email.toLowerCase() });
  },

  findByEmailOrIdentification(email?: string, identification?: string) {
    const conditions: Array<Record<string, string>> = [];

    if (email) {
      conditions.push({ email: email.toLowerCase() });
    }

    if (identification) {
      conditions.push({ identification });
    }

    if (conditions.length === 0) {
      return Promise.resolve(null);
    }

    return User.findOne({ $or: conditions });
  },

  create(payload: Pick<IUser, "name" | "email" | "identification" | "password" | "role">) {
    return User.create(payload);
  },
};
