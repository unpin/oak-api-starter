import { createHttpError, RouteParams, RouterContext } from "oak";
import { isObjectIdValid } from "../utils/isObjectIdValid.ts";
import { Status } from "oak";

export function validateObjectId<T extends string>(params: string[]) {
  return async function (
    ctx: RouterContext<T, RouteParams<T>>,
    next: () => Promise<unknown>,
  ) {
    const invalidIDs: string[] = params.filter((param) =>
      !isObjectIdValid(ctx.params[param])
    );
    if (invalidIDs.length) {
      throw createHttpError(
        Status.BadRequest,
        `Invalid ObjectId(s) (${invalidIDs.join(", ")})`,
      );
    }
    await next();
  };
}
