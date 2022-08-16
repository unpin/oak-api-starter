import { Context } from "oak";
import { Status } from "std/http/http_status.ts";
import { HttpError } from "../common/errors/HttpError.ts";
import { LOGGER } from "../common/Logger.ts";

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
