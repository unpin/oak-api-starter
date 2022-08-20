import { Context, createHttpError, Status } from "oak";

type RateLimitOptions = {
  max: number;
  windowMS: number;
  message?: string;
};

type RateLimitData = {
  remaining: number;
  timestamp: number;
};

const store: Map<string, RateLimitData> = new Map();

export function rateLimit(options: RateLimitOptions) {
  return async function (ctx: Context, next: () => Promise<unknown>) {
    const { ip } = ctx.request;
    let data = store.get(ip);

    if (!data) {
      data = {
        remaining: options.max,
        timestamp: Date.now(),
      };
      store.set(ip, data);
    }

    const diff = Date.now() - data.timestamp;

    if ((diff) > options.windowMS) {
      data.timestamp = Date.now();
      data.remaining = options.max;
    } else if (data.remaining > 0) {
      data.remaining--;
    } else {
      setRateLimitHeaders(ctx, options, data);
      throw createHttpError(Status.TooManyRequests, options.message);
    }

    setRateLimitHeaders(ctx, options, data);
    await next();
  };
}

function setRateLimitHeaders(
  ctx: Context,
  options: RateLimitOptions,
  data: RateLimitData,
) {
  ctx.response.headers.set("X-RateLimit", String(options.max));
  ctx.response.headers.set("X-RateLimit-Remaining", String(data.remaining));
  ctx.response.headers.set(
    "X-RateLimit-Timestamp",
    new Date(data.timestamp).toString(),
  );
}
