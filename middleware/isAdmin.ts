import { Status } from "std/http/http_status.ts";
import { composeMiddleware, Context, createHttpError } from "oak";
import { isAuth } from "./isAuth.ts";
import { UserRole } from "../resources/user/user.model.ts";

async function admin(ctx: Context, next: () => Promise<unknown>) {
  if (ctx.state?.user?.role === UserRole.ADMIN) {
    await next();
  } else {
    throw createHttpError(Status.Forbidden, "Access denied");
  }
}

export const isAdmin = composeMiddleware([isAuth, admin]);
