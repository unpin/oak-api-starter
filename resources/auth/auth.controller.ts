import { Context, createHttpError } from "oak";
import { compare, genSalt, hash } from "bcrypt";
import { Status } from "std/http/http_status.ts";
import { sign } from "../../common/jwt.ts";
import { User, UserRole } from "../user/user.model.ts";
import { JWT_CRYPTO_KEY } from "../../common/config.ts";

export async function signup(ctx: Context) {
  const { name, email, password } = await ctx.request.body({ type: "json" })
    .value;
  if (!name || !email || !password) {
    throw createHttpError(
      Status.BadRequest,
      "Please provide name, email and password",
    );
  }
  const user = await User.findOne({ email });
  if (user) {
    throw createHttpError(
      Status.Conflict,
      "User with this email already exists",
    );
  }
  const _id = await User.insertOne({
    name,
    email,
    password: await hash(password, await genSalt()),
  });
  const token = await sign({ sub: _id, role: UserRole.USER }, JWT_CRYPTO_KEY);
  ctx.response.status = Status.Created;
  ctx.response.body = { token, data: { user: { _id, name, email } } };
  ctx.cookies.set("token", token, { httpOnly: true });
}

export async function signin(ctx: Context) {
  const { email, password } = await ctx.request.body({ type: "json" }).value;
  if (!email || !password) {
    throw createHttpError(
      Status.BadRequest,
      "Please provide email and password",
    );
  }
  const user = await User.findOne({ email }) as {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
  };

  if (!user || !(await compare(password, user.password))) {
    throw createHttpError(
      Status.Unauthorized,
      "Incorrect email address or password",
    );
  }
  const token = await sign({ sub: user._id, role: user.role }, JWT_CRYPTO_KEY);
  ctx.response.status = Status.OK;
  ctx.response.body = { token };
}

export function removeAccount(ctx: Context) {
  // TODO
}
