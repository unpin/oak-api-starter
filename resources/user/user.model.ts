import { dango } from "../../deps.ts";

const userSchema = dango.schema({
  name: { type: "string", required: true },
  email: { type: "string", required: true, unique: true },
  password: { type: "string", required: true },
  isAdmin: { type: "boolean", default: false },
});

export const User = dango.model(
  "user",
  userSchema,
);
