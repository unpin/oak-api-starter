import { genSalt, hash } from "bcrypt";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../common/config.ts";
import { User } from "../resources/user/user.model.ts";

export async function seed() {
  const admin = await User.findOne({
    email: ADMIN_EMAIL,
  });
  if (admin) return;
  const salt = await genSalt();
  return User.insertOne({
    name: "Admin",
    email: ADMIN_EMAIL,
    password: await hash(ADMIN_PASSWORD, salt),
    isAdmin: true,
  });
}
