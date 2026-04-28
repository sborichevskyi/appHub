import Queue from "bull";

const hasUrl = !!process.env.REDIS_URL;
const hasHost = !!process.env.REDIS_HOST;

if (!hasUrl && !hasHost) {
  throw new Error("❌ Redis config missing");
}

export const jobQueue = hasUrl
  ? new Queue("fetch-jobs", process.env.REDIS_URL!)
  : new Queue("fetch-jobs", {
      redis: {
        host: process.env.REDIS_HOST!,
        port: Number(process.env.REDIS_PORT || 6379),
      },
    });