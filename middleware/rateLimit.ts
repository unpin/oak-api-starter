import { Context, createHttpError, Status } from "oak";

type RateLimitOptions = {
  /** The number of requests per user to allow within a specified time frame {@link RateLimitOptions.windowMS} */
  max: number;

  /** A time period for which requests are checked */
  windowMS: number;

  /** Enabling this will set X-RateLimit headers */
  headers?: boolean;

  /** The response message users get when they have exceeded the allowed limit */
  message?: string;
};

type UserRecord = {
  remaining: number;
  timestamp: number;
};

const store: Map<string, UserRecord> = new Map();

/**
 * Return rate limit middleware
 *
 * @param options - {@link RateLimitOptions}
 *
 * @return a rate limit middleware
 *
 * @emample - returns rate limit middleware that limits the number of requests
 * per IP address to 100 per hour.
 *
 * ```ts
 * rateLimit({ max: 100, windowMS: 1000 * 60 * 60})
 * ```
 */

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
    } else {
      const diff = Date.now() - data.timestamp;
      if (diff > options.windowMS) {
        data.timestamp = Date.now();
        data.remaining = options.max;
      } else if (data.remaining > 0) {
        data.remaining--;
      } else {
        ctx.response.headers.set(
          "Retry-After",
          new Date(data.timestamp + options.windowMS).toString(),
        );
        setRateLimitHeaders(ctx, options, data);
        throw createHttpError(Status.TooManyRequests, options.message);
      }
    }

    setRateLimitHeaders(ctx, options, data);
    await next();
  };
}

function setRateLimitHeaders(
  ctx: Context,
  options: RateLimitOptions,
  data: UserRecord,
) {
  if (!options.headers) return;
  ctx.response.headers.set("X-RateLimit", String(options.max));
  ctx.response.headers.set("X-RateLimit-Remaining", String(data.remaining));
}
