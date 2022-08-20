import { Status } from "std/http/http_status.ts";
import { composeMiddleware, Context, createHttpError } from "oak";
import { isAuth } from "./isAuth.ts";
import { UserRole } from "../resources/user/user.model.ts";

export function restrictTo(...allowedRoles: UserRole[]) {
  async function checkRole(ctx: Context, next: () => Promise<unknown>) {
    if (allowedRoles.includes(ctx.state.user.role)) {
      await next();
    } else {
      throw createHttpError(Status.Forbidden, "Access denied");
    }
  }
  return composeMiddleware([isAuth, checkRole]);
}
