import { Status } from "oak";
import { composeMiddleware, Context, createHttpError } from "oak";
import { isAuth } from "./isAuth.ts";
import { UserRole } from "../resources/user/user.model.ts";

export function restrictTo(...allowedRoles: UserRole[]) {
  async function checkRole(ctx: Context, next: () => Promise<unknown>) {
    if (!allowedRoles.includes(ctx.state.user.role)) {
      throw createHttpError(Status.Forbidden, "Access denied");
    }
    await next();
  }
  return composeMiddleware([isAuth, checkRole]);
}
