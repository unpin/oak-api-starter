import { LOGGER } from "../common/Logger.ts";
import { createHttpError, RouteParams, RouterContext } from "oak";
import { isObjectIdValid } from "../utils/isObjectIdValid.ts";
import { Status } from "std/http/http_status.ts";

export function validateObjectId<T extends string>(_id: string | string[]) {
  return async function (
    ctx: RouterContext<T, RouteParams<T>>,
    next: () => Promise<unknown>,
  ) {
    if (Array.isArray(_id)) {
      if (_id.every((id) => isObjectIdValid(ctx.params[id]))) {
        LOGGER.debug("ObjectID is valid");
        await next();
      } else {
        LOGGER.debug("ObjectID is NOT valid");
        throw createHttpError(Status.BadRequest, "Invalid ObjectIds");
      }
    } else {
      if (isObjectIdValid(ctx.params[_id])) {
        LOGGER.debug("ObjectID is valid");
        await next();
      } else {
        LOGGER.debug("ObjectID is NOT valid");
        throw createHttpError(Status.BadRequest, "Invalid ObjectId");
      }
    }
  };
}
