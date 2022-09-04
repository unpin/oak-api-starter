import { Context, isHttpError } from "oak";
import { Status } from "oak";
import { LOGGER } from "../common/Logger.ts";

export async function errorHandler(
  { response }: Context,
  next: () => Promise<unknown>,
) {
  try {
    await next();
  } catch (e) {
    console.error(e);
    if (isHttpError(e)) {
      LOGGER.debug(e);
      response.status = e.status;
      if (e.expose) {
        response.body = { error: e.message };
      }
    } else {
      LOGGER.error(e);
      response.status = Status.InternalServerError;
    }
  }
}
