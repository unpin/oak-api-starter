import { Context, createHttpError } from "oak";
import { Status } from "oak";
import { CRYPTO_KEY, verify } from "../common/jwt.ts";
import { User } from "../resources/user/user.model.ts";

export async function isAuth(ctx: Context, next: () => Promise<unknown>) {
  const authHeader = ctx.request.headers.get("Authorization");
  let token: string | undefined;
  if (authHeader && authHeader.startsWith("Bearer")) {
    token = authHeader.split(" ")[1];
  }
  if (!token) {
    throw createHttpError(
      Status.Unauthorized,
      "Authorization token is required",
    );
  }
  let decoded;
  try {
    decoded = await verify(token, CRYPTO_KEY);
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
    throw createHttpError(Status.Unauthorized, "User does not exist");
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
