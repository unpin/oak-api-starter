import { Context } from "oak";
import { Status } from "std/http/http_status.ts";
import { User } from "./user.model.ts";

export async function updateUser(ctx: Context) {
  const { sub: _id } = ctx.state.user as { sub: string };
  const { name } = await ctx.request.body({ type: "json" }).value;
  await User.findByIdAndUpdate(_id, { name });
  ctx.response.status = Status.OK;
  ctx.response.body = { message: "User information updated" };
}
