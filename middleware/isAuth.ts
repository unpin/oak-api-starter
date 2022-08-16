import { verify } from "../lib/jwt.ts";
import { Context, Status } from "../deps.ts";
import { JWT_CRYPTO_KEY } from "../config/config.ts";

export async function isAuth(ctx: Context, next: () => Promise<unknown>) {
  const auth = ctx.request.headers.get("Authorization");
  const token = auth?.split(" ")[1];
  if (token) {
    try {
      ctx.state.user = await verify(token, JWT_CRYPTO_KEY);
      await next();
    } catch {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = "Bearer token is invalid";
    }
  } else {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = "Bearer token is required";
  }
}
