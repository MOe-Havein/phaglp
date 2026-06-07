import { Redis } from "@upstash/redis";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    console.error(
      "Error: UPSTASH_REDIS_REST_URL or TOKEN is not defined in env",
    );
    process.exit(1);
  }

  console.log("Connecting to Upstash Redis...");
  const redis = new Redis({
    url: url,
    token: token,
  });

  try {
    const cacheKey = "public-lectures";
    console.log(`Deleting cache key: ${cacheKey}`);
    await redis.del(cacheKey);
    console.log("✓ Redis cache cleared successfully!");
  } catch (error) {
    console.error("✗ Failed to clear Redis cache:", error);
  }
}

main().catch(console.error);
