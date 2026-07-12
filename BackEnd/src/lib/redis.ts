import { createClient } from "redis";

export const redisClient = createClient({
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));

export const connectToRedis = async () => {
  try {
    await redisClient.connect();
    await redisClient.flushAll();
    console.log("success connected to Redis cache");
  } catch (error) {
    console.log("Failed to coonect to Redis", error);
  }
};
