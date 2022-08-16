import { ADMIN_EMAIL, ADMIN_PASSWORD } from "../config/config.ts";
import { bcrypt } from "../deps.ts";
import { User } from "../resources/user/user.model.ts";

export async function seed() {
  const admin = await User.findOne({
    email: ADMIN_EMAIL,
  });
  if (admin) return;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);
  return User.insertOne({
    name: "Admin",
    email: ADMIN_EMAIL,
    password: hashedPassword,
    isAdmin: true,
  });
}
