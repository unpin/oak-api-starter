import { verifyJWT } from "../common/jwt.ts";
import { Context, Status } from "../deps.ts";

export async function isAuth(ctx: Context, next: () => Promise<unknown>) {
  const auth = ctx.request.headers.get("Authorization");
  const token = auth?.split(" ")[1];
  if (token) {
    try {
      ctx.state.user = await verifyJWT(token);
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
