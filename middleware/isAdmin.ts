import { Status } from "std/http/http_status.ts";
import { Context, createHttpError } from "oak";

export async function isAdmin(ctx: Context, next: () => Promise<unknown>) {
  if (ctx.state?.user?.isAdmin) {
    await next();
  } else {
    createHttpError(Status.Forbidden, "Access denied");
  }
}
