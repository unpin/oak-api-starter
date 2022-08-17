import { Context, createHttpError } from "oak";
import { compare, genSalt, hash } from "bcrypt";
import { Status } from "std/http/http_status.ts";
import { getNumericDate, sign } from "../../common/jwt.ts";
import { User } from "../user/user.model.ts";
import { JWT_CRYPTO_KEY } from "../../common/config.ts";

export async function signup(ctx: Context) {
  const { name, email, password } = await ctx.request.body({ type: "json" })
    .value;
  if (!name || !email || !password) {
    throw createHttpError(
      Status.BadRequest,
      "All required fields must be provided",
    );
  }
  const user = await User.findOne({ email });
  if (user) {
    throw createHttpError(
      Status.Conflict,
      "User with this email already exists",
    );
  } else {
    // TODO Move JWT token generation to User model once API is provided
    const _id = await User.insertOne({
      name,
      email,
      password: await hash(password, await genSalt()),
    });
    const iat = getNumericDate(new Date());
    const exp = iat + 60 * 60 * 24;
    const token = await sign({ sub: _id, iat, exp }, JWT_CRYPTO_KEY);
    ctx.response.status = Status.Created;
    ctx.response.body = { token, data: { user: { _id, name, email } } };
    // TODO Should the JWT token be sent as a cookie?
    ctx.cookies.set("token", token, { httpOnly: true });
  }
}

export async function signin(ctx: Context) {
  const { email, password } = await ctx.request.body().value;
  if (!email || !password) {
    throw createHttpError(
      Status.BadRequest,
      "All required fields must be provided",
    );
  }
  const user = await User.findOne({ email }) as {
    _id: string;
    name: string;
    email: string;
    password: string;
    isAdmin: boolean;
  };
  if (!user) {
    throw createHttpError(
      Status.BadRequest,
      "Incorrect email address or password",
    );
  }
  const passwordsMatch = await compare(
    password,
    user.password,
  );
  if (!passwordsMatch) {
    throw createHttpError(
      Status.BadRequest,
      "The email address or password is incorrect",
    );
  }
  // TODO Move JWT token generation to User model once API is provided
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24;
  const token = await sign(
    { sub: user._id, iat, exp, isAdmin: user.isAdmin },
    JWT_CRYPTO_KEY,
  );
  const { password: _, ...publicUser } = user;
  ctx.response.status = Status.OK;
  ctx.response.body = { token, data: { user: publicUser } };
}

export function removeAccount(ctx: Context) {
  // TODO
}
