import { Context, createHttpError } from "oak";
import { Status } from "std/http/http_status.ts";
import { verify } from "../common/jwt.ts";
import { JWT_CRYPTO_KEY } from "../common/config.ts";
import { User } from "../resources/user/user.model.ts";

export async function isAuth(ctx: Context, next: () => Promise<unknown>) {
  const authHeader = ctx.request.headers.get("Authorization");
  let token: string | null = null;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    throw createHttpError(
      Status.Unauthorized,
      "Authorization token is required",
    );
  }
  let decoded = null;
  try {
    decoded = await verify(token, JWT_CRYPTO_KEY);
  } catch {
    throw createHttpError(
      Status.Unauthorized,
      "Authorization token is invalid",
    );
  }
  const foundUser = await User.findById(decoded.sub as string) as Record<
    string,
    unknown
  >;
  if (!foundUser) {
    throw createHttpError(Status.Unauthorized, "User does no longer exist");
  }
  if (
    foundUser.passwordChangedAt &&
    changedPasswordAfter(
      foundUser.passwordChangedAt as Date,
      decoded.iat as number,
    )
  ) {
    throw createHttpError(
      Status.Unauthorized,
      "Authorization token is no longer valid",
    );
  }
  ctx.state.user = decoded;
  await next();
}

function changedPasswordAfter(date: Date, seconds: number) {
  return Math.round(date.getTime() / 1000) > seconds;
}
