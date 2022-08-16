import { Status } from "std/http/http_status.ts";
import { Context } from "oak";

export async function isAdmin(ctx: Context, next: () => Promise<unknown>) {
  if (ctx.state?.user?.isAdmin) {
    await next();
  } else {
    ctx.response.status = Status.Forbidden;
    ctx.response.body = "Access denied";
  }
}
