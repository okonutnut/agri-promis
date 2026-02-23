// utils/rate-limiter.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
// or import { kv } from "@vercel/kv" if using Vercel KV

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});
// or const redis = kv;

export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, "10 s"), // 5 requests per 10 seconds
  analytics: true, // Optional: enable analytics
  /**
   * Optional: A function that is called each time a request is rate limited.
   * @param request The request that was rate limited.
   * @param result The rate limit result.
   */
  // onRateLimit: ({ request, result }) => { ... }
});
