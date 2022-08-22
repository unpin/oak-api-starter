import { LOGGER } from "../common/Logger.ts";
import { createHttpError, RouteParams, RouterContext } from "oak";
import { isObjectIdValid } from "../utils/isObjectIdValid.ts";
import { Status } from "oak";

export function validateObjectId<T extends string>(params: string[]) {
  return async function (
    ctx: RouterContext<T, RouteParams<T>>,
    next: () => Promise<unknown>,
  ) {
    if (params.every((id) => isObjectIdValid(ctx.params[id]))) {
      LOGGER.debug("ObjectID is valid");
      await next();
    } else {
      LOGGER.debug("ObjectID is NOT valid");
      throw createHttpError(Status.BadRequest, "Invalid ObjectIds");
    }
  };
}
