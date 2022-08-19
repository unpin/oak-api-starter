import { Context, createHttpError, RouterContext } from "oak";
import { Status } from "std/http/http_status.ts";
import { sign } from "../../common/jwt.ts";
import {
  correctPassword,
  hashPassword,
  User,
  UserRole,
} from "../user/user.model.ts";
import { JWT_CRYPTO_KEY } from "../../common/config.ts";
import { generateHexString } from "../../utils/generateHexString.ts";
import { sha256 } from "../../utils/crypto.ts";
import { sendMail } from "../../utils/mail.ts";

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
  checkPassword(password);
  const _id = await User.insertOne({
    name,
    email,
    password: await hashPassword(password),
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

  if (!user || !(await correctPassword(password, user.password))) {
    throw createHttpError(
      Status.Unauthorized,
      "Incorrect email address or password",
    );
  }
  const token = await sign({ sub: user._id, role: user.role }, JWT_CRYPTO_KEY);
  ctx.response.status = Status.OK;
  ctx.response.body = { token };
}

export async function forgotPassword(ctx: Context) {
  const { email } = await ctx.request.body({ type: "json" }).value;
  if (!email) throw createHttpError(Status.BadRequest, "Email is required");
  const user = await User.findOne({ email }) as Record<string, unknown>;
  if (!user) {
    throw createHttpError(Status.NotFound, "User with the email not found");
  }
  const resetToken = generateHexString(32);
  const TEN_MINUTES = 60 * 1000 * 10;
  await User.updateOne({ email }, {
    passwordResetToken: await sha256(resetToken),
    passwordResetExpires: new Date(Date.now() + TEN_MINUTES),
  });
  const { origin } = ctx.request.url;
  await sendMail({
    to: email,
    subject: "Password Recovery",
    content:
      `Forgot your password? Send a PATCH request to ${origin}/reset-password/${resetToken} with the (new) password and passwordConfirm fields. Reset token is valid for 10 minutes: ${resetToken}`,
  });
  ctx.response.status = Status.OK;
  ctx.response.body = {
    message: "We sent you an email with a link to get back into your account.",
  };
}

export async function resetPassword(
  ctx: RouterContext<"/reset-password/:token">,
) {
  const user = await User.findOne({
    passwordResetToken: await sha256(ctx.params.token),
  }) as {
    email: string;
    passwordResetToken: string;
    passwordResetExpires: Date;
  };
  if (!user || Date.now() > user.passwordResetExpires.getTime()) {
    throw createHttpError(Status.BadRequest, "Provided token expired");
  }
  const { password, passwordConfirm } = await ctx.request.body({ type: "json" })
    .value;
  checkPassword(password, passwordConfirm);
  await User.updateOne({ email: user.email }, {
    password: await hashPassword(password),
    passwordChangedAt: Date.now(),
    passwordResetToken: null,
    passwordResetExpires: null,
  });
  // TODO Sign new token after password change
  ctx.response.status = Status.OK;
  ctx.response.body = { message: `Password has been changed` };
}

export async function updatePassword(ctx: Context) {
  const { sub: _id } = ctx.state.user as { sub: string };
  const { password, newPassword, newPasswordConfirm } = await ctx.request.body({
    type: "json",
  }).value;
  ensureExists(password, "Password");
  checkPassword(newPassword, newPasswordConfirm);
  const user = await User.findById(_id) as { password: string };
  if (!(await correctPassword(password, user.password))) {
    throw createHttpError(Status.BadRequest, "Password is incorrect");
  }
  await User.findByIdAndUpdate(_id, {
    password: await hashPassword(newPassword),
    passwordChangedAt: Date.now(),
  });
  // TODO Sign new token after password change
  ctx.response.body = { message: "Password has been changed" };
}

export async function deleteAccount(ctx: Context) {
  const { sub: _id } = ctx.state.user as { sub: string };
  const { password } = await ctx.request.body({ type: "json" }).value;
  const user = await User.findById(_id) as { password: string };
  if (!user) {
    throw createHttpError(Status.BadRequest, "User does not exist");
  }
  if (!await correctPassword(password, user.password)) {
    throw createHttpError(Status.BadRequest, "Password is incorrect");
  }
  await User.findByIdAndUpdate(_id, { isActive: false });
  ctx.response.status = Status.NoContent;
}

function checkPassword(password: string, passwordConfirm?: string) {
  ensureExists(password, "Password");
  if (password.length < 6) {
    throw createHttpError(
      Status.BadRequest,
      "Password must be at least 6 characters long",
    );
  }
  if (passwordConfirm && password !== passwordConfirm) {
    throw createHttpError(Status.BadRequest, "Passwords do not match");
  }
}

function ensureExists(prop: unknown, propName: string) {
  if (prop === undefined) {
    throw createHttpError(Status.BadRequest, `${propName} is required`);
  }
}
