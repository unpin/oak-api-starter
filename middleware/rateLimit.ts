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

type RateLimitData = {
  remaining: number;
  timestamp: number;
};

const store: Map<string, RateLimitData> = new Map();

/**
 * Return middleware that rate limits incoming requests
 *
 * @param options - {@link RateLimitOptions}
 *
 * @return a rate limiting middleware
 *
 * @emample - returns a rate limiting middleware that will allow
 * no more than 100 requests per hour per IP address
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
  if (!options.headers) return;
  ctx.response.headers.set("X-RateLimit", String(options.max));
  ctx.response.headers.set("X-RateLimit-Remaining", String(data.remaining));
  ctx.response.headers.set(
    "X-RateLimit-Timestamp",
    String(new Date(data.timestamp)),
  );
}
