import { Context } from "oak";
import { Status } from "std/http/http_status.ts";
import { verify } from "../common/jwt.ts";
import { JWT_CRYPTO_KEY } from "../common/config.ts";

export async function isAuth(ctx: Context, next: () => Promise<unknown>) {
  const auth = ctx.request.headers.get("Authorization");
  const token = auth?.split(" ")[1];
  if (token) {
    try {
      ctx.state.user = await verify(token, JWT_CRYPTO_KEY);
      await next();
    } catch {
      ctx.response.status = Status.Unauthorized;
      ctx.response.body = "Authorization token is invalid";
    }
  } else {
    ctx.response.status = Status.Unauthorized;
    ctx.response.body = "Authorization token is required";
  }
}
