import { RouterContext, Status } from "../deps.ts";

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
