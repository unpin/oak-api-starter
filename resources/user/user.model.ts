import { dango } from "dango/mod.ts";
import { compare, genSalt, hash } from "bcrypt";

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

export async function hashPassword(password: string) {
  return await hash(password, await genSalt());
}

export async function correctPassword(
  candidatePassword: string,
  password: string,
) {
  return await compare(candidatePassword, password);
}
