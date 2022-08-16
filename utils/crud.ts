import { Status } from "std/http/http_status.ts";
import { Query } from "dango/lib/query.ts";
import { Context, RouteParams, RouterContext } from "oak";
import { handleHttpError } from "../common/handleHttpError.ts";

export function createOne(Model: Query) {
  return async function (ctx: Context) {
    try {
      const body = await ctx.request.body().value;
      const _id = await Model.insertOne(body);
      ctx.response.status = Status.Created;
      ctx.response.body = { data: { _id } };
    } catch (error) {
      handleHttpError(ctx, error);
    }
  };
}

export function getById<T extends string>(Model: Query) {
  return async function (ctx: RouterContext<T, RouteParams<T>>) {
    try {
      const id = ctx.params.id as string;
      const found = await Model.findById(id);
      if (found) {
        ctx.response.status = Status.OK;
        ctx.response.body = { data: found };
      } else {
        ctx.response.status = Status.NotFound;
      }
    } catch (error) {
      handleHttpError(ctx, error);
    }
  };
}

export function getMany(
  Model: Query,
  options: { pageLimit: number } = { pageLimit: 10 },
) {
  return async function (ctx: Context) {
    const DEFAULT_PAGE = 1;
    try {
      const LIMIT = Number(ctx.request.url.searchParams.get("limit")) ||
        options.pageLimit;
      const PAGE = Number(ctx.request.url.searchParams.get("page")) ||
        DEFAULT_PAGE;
      const objects = await Model.find({}, {
        limit: LIMIT,
        skip: Math.max(PAGE - 1, 0) * LIMIT,
      });
      ctx.response.status = Status.OK;
      ctx.response.body = { data: objects };
    } catch (error) {
      handleHttpError(ctx, error);
    }
  };
}

export function updateById(Model: Query) {
  return async function (ctx: RouterContext<"/users/:id", { id: string }>) {
    try {
      const { id } = ctx.params;
      const body = await ctx.request.body().value;
      const updated = await Model.findByIdAndUpdate(id, body) as Query;
      if (updated) {
        ctx.response.status = Status.OK;
        ctx.response.body = updated;
      } else {
        ctx.response.status = Status.NotFound;
      }
    } catch (error) {
      handleHttpError(ctx, error);
    }
  };
}

export function deleteById(Model: Query, options?: { data: boolean }) {
  return async function (ctx: RouterContext<"/users/:id", { id: string }>) {
    try {
      const { id } = ctx.params;
      const deleted = await Model.findByIdAndDelete(id) as Query;
      if (deleted) {
        if (options && options.data) {
          ctx.response.status = Status.OK;
          ctx.response.body = deleted;
        } else {
          ctx.response.status = Status.NoContent;
        }
      } else {
        ctx.response.status = Status.NotFound;
      }
    } catch (error) {
      handleHttpError(ctx, error);
    }
  };
}

export function deleteMany(Model: Query) {
  return async function (ctx: Context) {
    try {
      const body = await ctx.request.body().value;
      const deletedCount = await Model.deleteMany({ ...body });
      ctx.response.status = Status.OK;
      ctx.response.body = { deletedCount };
    } catch (error) {
      handleHttpError(ctx, error);
    }
  };
}
