import { LOGGER } from "../common/Logger.ts";
import { RouteParams, RouterContext } from "oak";
import { isObjectIdValid } from "../utils/isObjectIdValid.ts";

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
        ctx.response.status = 400;
        ctx.response.body = "Invalid ObjectIds";
      }
    } else {
      if (isObjectIdValid(ctx.params[_id])) {
        LOGGER.debug("ObjectID is valid");
        await next();
      } else {
        LOGGER.debug("ObjectID is NOT valid");
        ctx.response.status = 400;
        ctx.response.body = "Invalid ObjectId";
      }
    }
  };
}
