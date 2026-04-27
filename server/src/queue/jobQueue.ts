import dotenv from "dotenv";
import Queue from "bull";
dotenv.config();

export const jobQueue = new Queue("fetch-jobs", process.env.REDIS_URL as string);

jobQueue.on("error", (err) => {
  console.error("Redis connection error:", err);
});

jobQueue.on("ready", () => {
  console.log("✅ Connected to Redis at", jobQueue.client.options);
});
