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

const visitorMap: Map<string, RateLimitData> = new Map();

export function rateLimit(options: RateLimitOptions) {
  return async function (ctx: Context, next: () => Promise<unknown>) {
    const { ip } = ctx.request;
    let data = visitorMap.get(ip);

    if (data) {
      data.remaining--;
    } else {
      data = {
        remaining: options.max,
        timestamp: Date.now(),
      };
      visitorMap.set(ip, data);
    }

    const diff = Date.now() - data.timestamp;

    if (data.remaining < 1) {
      if ((diff) < options.windowMS) {
        data.remaining = 0;
        setRateLimitHeaders(ctx, options, data);
        throw createHttpError(Status.TooManyRequests, options.message);
      }
      data.timestamp = Date.now();
      data.remaining = options.max;
    } else if ((diff) > options.windowMS) {
      data.timestamp = Date.now();
      data.remaining = options.max;
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
