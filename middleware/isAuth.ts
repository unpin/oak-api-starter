import { Context, createHttpError } from "oak";
import { Status } from "std/http/http_status.ts";
import { verify } from "../common/jwt.ts";
import { JWT_CRYPTO_KEY } from "../common/config.ts";

export async function isAuth(ctx: Context, next: () => Promise<unknown>) {
  const auth = ctx.request.headers.get("Authorization");
  const token = auth?.split(" ")[1];
  if (!token) {
    throw createHttpError(
      Status.Unauthorized,
      "Authorization token is required",
    );
  }
  try {
    ctx.state.user = await verify(token, JWT_CRYPTO_KEY);
  } catch {
    throw createHttpError(
      Status.Unauthorized,
      "Authorization token is invalid",
    );
  }
  await next();
}
