import { dango } from "dango/mod.ts";
import { compareSync, genSaltSync, hashSync } from "bcrypt";

export enum UserRole {
  ADMIN = "admin",
  USER = "user",
}

const userSchema = dango.schema({
  name: { type: "string", required: true },
  email: { type: "string", required: true, unique: true },
  password: { type: "string", required: true },
  role: { type: "string", default: UserRole.USER },
  passwordChangedAt: { type: "date", default: null },
  passwordResetToken: { type: "string", default: null },
  passwordResetExpires: { type: "date", default: null },
  isActive: { type: "boolean", default: true },
});

export const User = dango.model(
  "user",
  userSchema,
);

export function hashPassword(password: string) {
  return hashSync(password, genSaltSync());
}

export function correctPassword(
  candidatePassword: string,
  password: string,
) {
  return compareSync(candidatePassword, password);
}
