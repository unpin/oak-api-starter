import { Status } from "std/http/http_status.ts";
import { RouterContext } from "oak";

export async function isUserWithMatchingId(
  ctx: RouterContext<"/users/:id", { id: string }>,
  next: () => Promise<unknown>,
) {
  console.log("test ID match");

  if (!ctx.state.user) {
    return ctx.response.status = Status.Unauthorized;
  }
  const { sub } = ctx.state.user;
  console.log({ sub, paramID: ctx.params.id });

  if (!(sub && sub === ctx.params.id)) {
    return ctx.response.status = Status.Forbidden;
  }
  await next();
}
