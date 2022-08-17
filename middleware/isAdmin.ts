import { Status } from "std/http/http_status.ts";
import { composeMiddleware, Context, createHttpError } from "oak";
import { isAuth } from "./isAuth.ts";

async function admin(ctx: Context, next: () => Promise<unknown>) {
  if (ctx.state?.user?.isAdmin) {
    await next();
  } else {
    throw createHttpError(Status.Forbidden, "Access denied");
  }
}

export const isAdmin = composeMiddleware([isAuth, admin]);
