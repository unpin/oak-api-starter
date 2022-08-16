import { HttpError } from "../common/errors/HttpError.ts";
import { LOGGER } from "../common/Logger.ts";
import { Context, Status } from "../deps.ts";

export function handleHttpError(ctx: Context, error: Error) {
  if (error instanceof HttpError) {
    LOGGER.debug(error);
    ctx.response.status = error.status;
    ctx.response.body = { error: error.message };
  } else {
    LOGGER.error(error);
    ctx.response.status = Status.InternalServerError;
    ctx.response.body = { error: "Something went wrong" };
  }
}

Deno.errors.Http;
