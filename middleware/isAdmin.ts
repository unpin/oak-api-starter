import { Context, Status } from "../deps.ts";

export async function isAdmin(ctx: Context, next: () => Promise<unknown>) {
  if (ctx.state?.user?.isAdmin) {
    await next();
  } else {
    ctx.response.status = Status.Forbidden;
    ctx.response.body = "Access denied";
  }
}
